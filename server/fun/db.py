import mysql.connector as db
import datetime


import mysql.connector as sql
import datetime
import json

def upload_timetable(data):
    # try:
    class_name = data['class_name']
    query1 = f"create table {class_name}(day_name varchar(20), period_1 varchar(100), period_2 varchar(100), period_3 varchar(100), period_4 varchar(100), period_5 varchar(100), period_6 varchar(100), period_7 varchar(100), period_8 varchar(100), period_9 varchar(100));"
    cursor.execute(query1)
    connection.commit()
    add_new_class(class_name)
    for day in data['periods']:
        query_insert = f"insert into {class_name} values('{day}', '{data['periods'][day][0]}', '{data['periods'][day][1]}', '{data['periods'][day][2]}', '{data['periods'][day][3]}', '{data['periods'][day][4]}', '{data['periods'][day][5]}', '{data['periods'][day][6]}', '{data['periods'][day][7]}', '{data['periods'][day][8]}');"
        cursor.execute(query_insert)
        connection.commit()
            
    return True     # Insertion Success

def add_new_class(class_name):
    time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    queryfinal = f'insert into classUpdated values("{class_name}", "{time}")'
    print(queryfinal)
    cursor.execute(queryfinal)
    connection.commit()
    
def get_class_data(class_name):
    # Check whether class data is present
    query_to_check_presence_class = f'select * from classUpdated where class_updated in ("{class_name}");'
    cursor.execute(query_to_check_presence_class)
    result = cursor.fetchall()
    if(len(result) == 0):
        return {'400':'not found'}
    else:
        query_to_get_data = f'select * from {class_name};' 
        query_to_fetch_sub_name = f"select * from {class_name.split('_')[0] + '_' + class_name.split('_')[1]};"
        class_dict = {
            'class_name': '',
            'periods': {
            },
            'last_updated': result[-1][-1].strftime('%Y-%m-%d %H:%M:%S')
        }
        
        class_dict['class_name'] = class_name.split('_')[1] + '-' + class_name.split('_')[0] + '-'+ class_name.split('_')[-1]
        cursor.execute(query_to_get_data)
        response = cursor.fetchall()
        
        cursor.execute(query_to_fetch_sub_name)
        sub_code_to_name = dict()
        for course_code, course_name in  cursor.fetchall():
            sub_code_to_name.update({
                course_code: course_name
            })
            
        for i in response:
            day_dict = {
                
            }
            current_day = i[0]
            
            day_dict.update(
                {
                    current_day: []
                }
            )
            for period in i[1:]:
                if 'BREAK' in period or 'LUNCH' in period:
                    break_name, break_time = period.split('/')
                    day_dict[current_day].append([break_name,break_time])
                else:
                    sub_name, venue, time = period.split('/')
                    if 'lab' not in sub_name.lower():
                        try:
                            sub_abbr = sub_code_to_name[sub_name]
                        except:
                            sub_abbr = 'Unknown'
                    else:
                        sub_abbr = 'LAB'
                    day_dict[current_day].append([
                        sub_name,
                        sub_abbr,
                        venue,
                        time
                    ])
            class_dict['periods'].update(day_dict)
    return class_dict

# True - Data present alread
# False - Data not present
def check_class(class_name):
    query = f'select class_updated from classUpdated;'
    cursor.execute(query)
    result = [i[0] for i in cursor.fetchall()]
    if class_name in result:
        return True
    return False
        
try:
    connection = db.connect(
                host='db',
                database='rec_companion',
                passwd='root',
                user='root'
    )
    cursor = connection.cursor()
except:
    print("Something went wrong with db")