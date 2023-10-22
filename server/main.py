import os.path
import pandas as pd
import json
from flask import Flask, render_template, request, redirect, flash, jsonify

from fun.read_xlsx import read_xls
from fun.db import *

app = Flask(__name__)
app.secret_key = "secret"


@app.route('/uploaddept', methods=['GET', 'POST'])
def upload_dept_sub():
    #TODO: make a function to get subject code and subject name and store it in sql server under table: deptcode_year
    
    if request.method == 'POST':
        pass
    else:
        return render_template('uploadsub.html')


#TODO:
# 1. Check whether input entered by user follows specified pattern

@app.route('/uploadtimetable', methods=['GET', 'POST'])
def upload_time_table():
    if request.method == 'POST':
        class_dict = {
            'class_name': '',
            'periods': {
                
            }
        }
        
        class_dict['class_name'] = request.form.get('class_name')
        for i in range(5):
            current_day = request.form.get('day_' + str(i))
            
            periods = [request.form.get('period_' + str(i) + str(j)) for j in range(1,10)]
            class_dict['periods'].update({
                current_day: periods
            })
        
        if upload_timetable(class_dict):
            # on uploading done
            flash("Upload Success")
            return redirect("upload")
        else:
            return "<h1>Something went wrong while uploading</h1>"
    else:
        return render_template('table_upload.html')

@app.route('/check_existence', methods=['GET'])
def check_with_db():
    class_name = request.args.get("class_name")
    check = check_class(class_name)
    if not check:
        return redirect('/uploadtimetable')
    else:
        flash('Class data present!')
        return redirect('upload')
        

@app.route('/upload', methods=['GET'])
def index():
    return render_template('upload_1.html')


def create_tt(class_name):
    res = get_class_data(class_name)

    res = jsonify(res)
    return res


@app.route("/<name>", methods=['GET', 'POST'])
def hello_world(name):
    # get api method
    if request.method == 'GET':
        data = create_tt(name)
        if data:
            return data
        else:
            return "Error"

    if request.method == 'POST':
        return "POST REQ recieved"


if __name__ == "__main__":
    # app.run()
    app.run(host='0.0.0.0', port=5000, debug=True)
