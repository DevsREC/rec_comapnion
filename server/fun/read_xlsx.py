import pandas as pd
import json
import logging

def remove_empty_space(l):
    nl = []
    for i in l:
        if i != '':
            nl.append(i)
    return nl

def roman_to_no(roman):
    roman_dict = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4
    }
    
    return str(roman_dict[roman])

'''
The following function creates a json file of following structure

{
    'CLASS_NAME': {
        
    },
    'PERIODS': {
        'DAY': {
            [SUBJECT CODE, ROOM NO, SUBJECT NAME, PERIOD NUMBER, TIME]
        }
    }
}

'''

def read_xls(file_path, write_path):
    fp = file_path
    class_year = ''
    class_find = False
    found_all_day = False
    crossed_course_title = False
    timetable_dict = {
        'COURSE TITLE': {}
    }

    fina_res = {
        'CLASS_NAME': [],
        'PERIODS': {
            
        }
    }

    df = pd.read_excel(fp)
    for i in df.to_dict(orient = 'records'):
        class_data_head = str(list(i.values())[0]).strip()
        class_data = list(i.values())[1:]
        
        # Finding class
        if not(class_find) and 'Year' in class_data_head:
            if 'Sec' in class_data_head:
                sec = class_data_head.split('Sec:')[-1][0]
            else:
                sec = ''
            class_year = class_data_head.split('Year:')[1].split('Sem:')[0].strip() + ' ' + sec
            number = roman_to_no(class_year.split(' ')[0])
            class_year.replace(class_year.split(' ')[0], number)
            class_year = number +'-' + '-'.join(class_year.split(' ')[1:])
            logging.info(class_year)
            fina_res['CLASS_NAME'].append(class_year)
            class_find = True
            
        new_dict = {}
        
        # Extracting timetable
        if not found_all_day and 'DAY' in class_data_head:
            new_dict[class_data_head] = []
            for j in range(len(class_data)):
                if str(class_data[j]) == 'nan' and j == 2:
                    new_dict[class_data_head].append(['BREAK'])  
                elif str(class_data[j]) == 'nan':
                    new_dict[class_data_head].append([class_data[j-1]])
                else:
                    new_dict[class_data_head].append([class_data[j]])
        
        if 'SATURDAY' in class_data_head:
            found_all_day = True
        
        if 'COURSE TITLE' in class_data:
            crossed_course_title = True
            continue
        
        #Extracting Subject code:
        if crossed_course_title:
            if str(class_data[0]) not in ['nan', 'TIME TABLE INCHARGE                                                                   TIME TABLE COORDINATOR                                                            HOD                                                                PRINCIPAL']:       # Don't modify this!
                timetable_dict['COURSE TITLE'].update({class_data_head: class_data[0]})
                continue
        
        
        timetable_dict.update(new_dict)


    for i in timetable_dict:
        if i in ['TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']:
            my_dict = {
                i: []
            }
            for j in range(len(timetable_dict[i])):
                if '\n' in timetable_dict[i][j][0]:
                    current_period = timetable_dict[i][j][0].split('\n')
                    current_period[-1] = ''.join(current_period[-1].split(' '))    # formatting class romm no
                    if(len(current_period) == 3):
                        current_period[0:2] = ['/'.join(current_period[0:2])]
                    if '/' in current_period[0]:
                        current_period[0] = current_period[0].split('/')
                        current_period[0] = '/'.join(current_period[0]).strip()
                        current_period.append('LAB')
                    else:
                        current_period[0] = current_period[0].split(' ')
                        sub_code = current_period[0][0]
                        if sub_code not in ['BREAK', 'LUNCH']:
                            try:
                                current_period[0] = remove_empty_space(current_period[0])
                                current_period.append(timetable_dict['COURSE TITLE'][sub_code])
                            except:
                                current_period.append('NA')
                        current_period[0] = ' - '.join(current_period[0])
                else:
                    current_period = timetable_dict[i][j][0].split(' ')
                    room_no = ''.join(current_period[-2:])
                    current_period[-2:] = [room_no]
                    sub_code = current_period[0]
                    if sub_code not in ['BREAK', 'LUNCH']:
                        try:
                            current_period.append(timetable_dict['COURSE TITLE'][sub_code])
                        except:
                            current_period.append('NA')
                    current_period[0:2] = [' - '.join(current_period[0:2])]
                    
                if '\n' in timetable_dict['DAY'][j][0]:
                    time = timetable_dict['DAY'][j][0].split('\n')
                    current_period.append(time[0].strip())
                    current_period.append(time[1].strip())
                else:
                    time = timetable_dict['DAY'][j][0]
                    current_period.append(time)
                current_period = remove_empty_space(current_period)
                my_dict[i].append(current_period)
            fina_res['PERIODS'].update(my_dict)
            
    wirte_file_path = write_path + '/' + fina_res['CLASS_NAME'][-1] + '.json' 
    with open(wirte_file_path, 'w', encoding='UTF-8') as f:
        json.dump(fina_res, f, indent= 4)