from flask import Flask, request
from flask_cors import CORS

import logging

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from functools import wraps
import jwt

import requests
import mysql.connector
import json, os

from google.oauth2 import id_token

# renamed to fix same name as requests lib
from google.auth.transport import requests as google_req

CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "secret"
app.config["JWT_SECRET_KEY"] = CLIENT_ID
app.config["JWT_TOKEN_LOCATION"] = "headers"
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# Log config
logging.basicConfig(filename='app.log', level=logging.INFO)

# For Rec transport
ROOT_URL = 'https://www.rectransport.com/'
# response_to_send = []
busResponse = []
lastfetchedDate = -1

def login_required(f):
    try:
        @wraps(f)
        def decorated_function(*args, **kwargs):
            print(request.headers)
            if request.headers["Authorization"]:
                token = request.headers.get("Authorization")
                token = token.split()[1]
                idinfo = id_token.verify_oauth2_token(
                    token, google_req.Request(), CLIENT_ID, clock_skew_in_seconds=10
                )
                
                if idinfo["sub"]:
                    app.logger.info(f'{idinfo['sub']} - Logined - {datetime.now()}')
                    return f(*args, **kwargs), 200
            return "Try Loging in..", 403

        return decorated_function
    except Exception:
        print(Exception)
        return

def countUsers(mf):
    with open(mf) as f:
        login_set = set()
        for l in f:
            if 'Logined' in l:
                try:
                    user_id = l.split()[0]
                    login_set.add(user_id)
                except:
                    pass
    return len(login_set)


@app.route('/get-user-count')
def get_user_count():
    res = countUsers('app.log')
    return {"count": res}

# todo change to email
def get_id(header):
    token = header.get("Authorization")
    token = token.split()[1]
    decoded = jwt.decode(token, options={"verify_signature": False})
    email = decoded["email"]

    mydb = mysql.connector.connect(
        host="db", user="root", password="root", port=3306, database="users"
    )

    mycursor = mydb.cursor()
    get_user_query = "SELECT UNIFIED_ID from users where EMAIL=%s"
    user_data = (email,)
    mycursor.execute(get_user_query, user_data)
    person_id = mycursor.fetchone()
    if person_id:
        print(f"person '{person_id}' exists.")
        mydb.close()
        return person_id[0]
    else:
        print(f"person '{person_id}' does not exist.")
        mydb.close()
        return -1


@app.route("/get-photo/")
@login_required
def get_photo():
    # person_id = get_id(rollno)

    # debug
    person_id = get_id(request.headers)

    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "10%2C12",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonID": person_id,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/RetrievePersonPhoto",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    image = response.json()["d"]
    data = {"image": image[1:-1]}
    return data


@app.route("/get-info/")
@login_required
def get_info():
    person_id = get_id(request.headers)
    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "10%2C12",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonID": person_id,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx/GetPersonInfo",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )

    data = response.json()
    data = json.loads(data["d"])
    data = data[0]

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonID": person_id,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx/GetStuHeaderDetails",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )

    header = response.json()
    header = json.loads(header["d"])[0]
    data.update(header)
    return data


@app.route("/internal-marks/")
@login_required
def internal_marks():
    person_id = get_id(request.headers)
    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "10%2C12",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonId": person_id,
        "Semester": 0,
        "Category": 0,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/BindInternalMarks",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    data = json.loads(response.json()["d"])
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
    """
    creates mod_data with
    8 semesters
    3 internal cats in each
    """
    mod_data = {i:[[] for _ in range(3) ] for i in range(1, 9)}
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
        title = test["EventTitle"]
        test_sem = int(test["Semester"])
        total = test["Total"]

        cat = title.split("/")[2]
        cat = cat.strip(" ").replace(" ", "")
        cat = cat.upper()

        cat_no = 0
        if "CATEST" in cat:
            if "1" in cat:
                cat_no = 0
            if "2" in cat:
                cat_no = 1
            if "3" in cat:
                cat_no = 2

            if test_sem in mod_data.keys():
                if total:
                    mod_data[test_sem][cat_no].append(test)
            # else:
            #     mod_data[test_sem] = [
            #         [],  # cat 1
            #         [],  # cat 2
            #         [],  # cat 3
            #     ]
            #     if total:
            #         mod_data[test_sem][cat_no].append(test)

    return mod_data


@app.route("/get-sems/")
@login_required
def get_sems():
    """
    app route: http://localhost/<rollno>/<sem>
    default sem: 0 -> gives the possible semesters
    returns numbers of semesters
    """
    person_id = get_id(request.headers)

    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "0000000",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonId": person_id,
        "Semester": 0,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/BindSemester",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )

    data = response.json()
    data = json.loads(data["d"])

    return data


@app.route("/sem-marks/")
@app.route("/sem-marks/<int:sem>")
@login_required
def semester_marks(sem=0):
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
    person_id = get_id(request.headers)
    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "0000000",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "PersonId": person_id,
        "Semester": sem,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/HRMS/ManageStaffStudent/UniPersonInfo.asmx/BindGrade",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    data = response.json()
    data = json.loads(data["d"])
    """
    data modal: is gonna be easy for this unlinke internalmarks
    just an array of dict
    with each sem having their own dict array
    """
    mod_data = {}
    for sem in data:
        if sem["Semester"] in mod_data.keys():
            mod_data[sem["Semester"]].append(sem)
        else:
            mod_data[sem["Semester"]] = []
            mod_data[sem["Semester"]].append(sem)
    for i in range(1, 9):
        i = str(i)
        if i in mod_data.keys():
            break
        mod_data[i] = []

    return mod_data


# TODO
@app.route("/get-attendance")
@login_required
def get_attendance():
    person_id = get_id(request.headers)

    from datetime import date
    today = date.today()
    today = today.strftime("%d-%m-%Y")
    st_date = "01-01-2024"

    #####################
    # GET SUBJECT NAMES #
    #####################
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
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    }

    json_data = {
        'PersonID': person_id,
    }

    response = requests.post(
        'http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx/GetStuCourse',
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )

    data = response.json()["d"]
    data = json.loads(data)
    print("printing...")
    subjnames = {}
    for i in data:
        subjnames[i['SUBJCODE']] = i['SUBJNAME']

    #####################################################
    # COMBINE THE SUBJECTNAME WITH ATTENDANCE TILL DATE #
    #####################################################
    cookies = {
        "G_ENABLED_IDPS": "google",
        "ASP.NET_SessionId": "000000000000000000000000",
        "dcjq-accordion": "10%2C12",
    }

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "http://rajalakshmi.in",
        "Referer": "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx?FormHeading=myProfile",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
    }

    json_data = {
        "StartDate": st_date,
        "EndDate": today,
        "PersonID": person_id,
    }

    response = requests.post(
        "http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx/GetStudentAttendanceDetail",
        cookies=cookies,
        headers=headers,
        json=json_data,
        verify=False,
    )
    data = response.json()["d"]
    data = json.loads(data)

    periods = [ "Period1", "Period2", "Period3", "Period4", "Period5", "Period6", "Period7", "Period8" ]
    classes = {}
    for day in data:
        for period in periods:
            if day[period] != '-NE-':
                tmp = day[period].split('- ')
                status = tmp[0]
                class_code = tmp[1]
                class_code = class_code.replace('(', '')
                class_code = class_code.replace(')', '')
                if class_code in subjnames:
                    if class_code in classes:
                        classes[class_code]['total'] += 1
                        if status == 'P':
                            classes[class_code]['present'] += 1
                        else:
                            classes[class_code]['absent'] += 1
                    else:
                        if status == 'P':
                            present = 1
                            absent = 0
                        else:
                            present = 0
                            absent = 1
                        classes[class_code] = {
                                "present": present,
                                "absent": absent,
                                "total": 1,
                                }

    for key, val in classes.items():
        per = float(val['present'])/float(val['total'])*100.0
        per = round(per, 2)
        classes[key]['percentage'] = per
        classes[key]['classname'] = subjnames[key]
        
    mod_data = []
    for key, val in classes.items():
        mod_data.append({
                "SubjName": key,
                "classname": val['classname'],
                "present": val['present'],
                "absent": val['absent'],
                "percentage": val['percentage'],
                "total": val['total']
                })

    return mod_data

def extract_href_from_class(url, class_name):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        elements = soup.find_all(class_=class_name)

        href_values = [element.get('href') for element in elements if element.get('href')]

        return href_values

    except requests.exceptions.RequestException as e:
        print("Error:", e)
        return None
    
def get_route_details(route_url):
    try:
        response = requests.get(route_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        # print(soup)
        rows = soup.find_all('tr')

        bus_point_with_time = []
        for row in rows:
            columns = row.find_all('td')
            if len(columns) == 2:
                bpt_value = columns[0].get_text().strip()
                tim_value = columns[1].get_text().strip()
                bus_point_with_time.append({'pointName': bpt_value, 'pointTime': tim_value})
        
        route_name = soup.find(class_ = 'bbpt').get_text()
        if '.' in route_name:
            route_name = route_name.split('.')
        elif '-' in route_name:
            route_name = route_name.split('-')
        else:
            route_name = route_name.split(' ')
        bNo = route_name[0]
        bpt = route_name[-1].strip()

        return {
            'busNo': bNo,
            'bpt': bpt,
            'routes': bus_point_with_time
        }
    except Exception as e:
        # print('Fucked Up!')
        # print(e)
        return None
    
def getBus():
    print('I\'m running')
    # today_date = (datetime.now() + timedelta(days=1)).strftime('%d')
    today_date = datetime.now().strftime('%d')
    print(today_date)
    # tomorrow_date = (datetime.now() + timedelta(days=1)).strftime('%d')
    this_month = datetime.now().strftime('%b').lower()
    lastfetchedDate = today_date
    url1 = "https://www.rectransport.com/" + str(this_month) + str(today_date) + '.php'
    class_name = "info"
    print(url1)
    res1 = extract_href_from_class(url1, class_name)
    print(res1)
    l = []
    if res1 != None:
        for i in res1:
            route_url = ROOT_URL + '/' + i
            d = get_route_details(route_url)
            l.append(d)
        return l
    return []

@app.route('/get-bus')
def getBus1():
    global busResponse, lastfetchedDate 
    if lastfetchedDate != datetime.now().strftime('%d'):
        print('Updating bus details')
        busResponse = getBus()
    return busResponse

def start_scheduler():
    print('Scheduler started')
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.add_job(getBus1, CronTrigger(hour=0))
    scheduler.start()

if __name__ == "__main__":    
    start_scheduler()
    busResponse = getBus1()
    app.run(host="0.0.0.0", port=5000, debug=True)
    app.run(use_reloader=True)
