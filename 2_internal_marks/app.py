from flask import Flask
from flask_cors import CORS
import requests
import mysql.connector
import json

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "secret"


def get_id(rollno):

    mydb = mysql.connector.connect(
        host="db",
        user="root",
        password="root",
        port=3306,
        database="users"
    )

    mycursor = mydb.cursor()
    get_user_query = "SELECT UNIFIED_ID from users where ROLLNO=%s"
    user_data = (rollno,)
    mycursor.execute(get_user_query, user_data)
    person_id = mycursor.fetchone()
    if person_id:
        print(f"person '{person_id}' exists.")
        mydb.close()
    else:
        print(f"person '{person_id}' does not exist.")
    mydb.close()

    return person_id[0]


@app.route('/<int:rollno>')
def marks(rollno):
    person_id = get_id(rollno)
    cookies = {
        'G_ENABLED_IDPS': 'google',
        'ASP.NET_SessionId': '000000000000000000000000',
        'dcjq-accordion': '10%2C12',
    }

    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': 'http://rajalakshmi.in',
        'Referer': 'http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    }

    json_data = {
        'PersonId': person_id,
        'Semester': 0,
        'Category': 0,
    }

    response = requests.post(
        'http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/BindInternalMarks',
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    data = json.loads(response.json()['d'])
    """
    example data:
    {
        #sem
        1:[
        cat 1,{}
        cat 2,{}
        cat 3,{}
        ]
        2:[...]
    }
    """
    mod_data = {}
    for test in data:
        """
            'CATEST1'
            'CAT TEST1'
            'CAT TEST 1'
            'CATEST3(IIYEAR-FN)'
            'ASSIGNMENTI'
            unified backend was written by a bunch of monkeys while they were drunk and on meth.
            the fact that it works at all is a big achievement.
            In my opinion the servers that the code runs on should be cleansed with fire and whoever was in charge of
            desiging the api should just give up software development and move onto something better like becoming a farmer
            even then i don't think they can manage that.

            fuck it I am gonna just check if 'TEST' is in the string. or ASSIGNMENT
            and a cat number(1,2,3)

            CourseName	"B.Tech-IT"
            EventTitle	"2022-23/ODD/CA TEST 1 / II Year/Regular/UG"
            FirstName	"********"
            PersonId	*****
            SectionName	"A"
            Semester	"3"
            SubjName	"Software Engineering Essentials"
            Total	null
            U1	0
            U2	0
            U3	0
            U4	0
            U5  0

            sometimes they just like to return a fucking null.


        """
        title = test['EventTitle']
        test_sem = int(test['Semester'])
        total = test['Total']

        cat = title.split("/")[2]
        cat = cat.strip(" ").replace(" ", "")
        cat = cat.upper()

        cat_no = 0
        if 'CATEST' in cat:
            if '1' in cat:
                cat_no = 0
            if '2' in cat:
                cat_no = 1
            if '3' in cat:
                cat_no = 2

            if test_sem in mod_data.keys():
                if total:
                    mod_data[test_sem][cat_no].append(test)
            else:
                mod_data[test_sem] = [
                    [],  # cat 1
                    [],  # cat 2
                    [],  # cat 3
                ]
                if total:
                    mod_data[test_sem][cat_no].append(test)

    return mod_data


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
