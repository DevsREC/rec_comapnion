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


# two app.route()
# to make the <int:sem> optional
@app.route('/<int:rollno>/')
@app.route('/<int:rollno>/<int:sem>')
def marks(rollno, sem=0):
    """
    app route: https://loalhost/<rollno>/<sem>
    <roll_no> user roll number is provided them their unified id is retrived from database
    <sem>
        0 - to retrieve all
        1 - semester 1
        .
        .
        .

    """
    person_id = get_id(rollno)
    cookies = {
        'G_ENABLED_IDPS': 'google',
        'ASP.NET_SessionId': '000000000000000000000000',
        'dcjq-accordion': '0000000',
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
        'Semester': sem,
    }

    response = requests.post(
        'http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/BindGrade',
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    data = response.json()
    data = json.loads(data['d'])
    """
    data modal: is gonna be easy for this unlinke internalmarks
    just an array of dict
    with each sem having their own dict array
    """
    mod_data = {}
    for sem in data:
        if sem['Semester'] in mod_data.keys():
            mod_data[sem['Semester']].append(sem)
        else:
            mod_data[sem['Semester']] = []
            mod_data[sem['Semester']].append(sem)

    return mod_data


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
