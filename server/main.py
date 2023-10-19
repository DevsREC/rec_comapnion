import os.path
import pandas as pd
import json
from flask import Flask, render_template, request, redirect, flash, jsonify
from werkzeug.utils import secure_filename

from fun.read_xlsx import read_xls
from fun.db import *

app = Flask(__name__)
app.secret_key = "secret"


allowed_extensions = ['.xlsx']

UPLOAD_PATH = os.path.join(os.getcwd(), 'timetable_upload')
JOSN_PATH = os.path.join(os.getcwd(), 'timetable_upload/json')

# TODO
# Create response endpoint

# make file upload - Done
# read from excel file - Done

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


# @app.route('/upload', methods=['POST'])
# def upload_files():
#     pass
#     if 'file' not in request.files:
#         flash('No file part')
#         return redirect('upload')

#     file = request.files['file']
#     # obtaining the name of the destination file
#     filename = file.filename
#     if filename == '':
#         flash('No file selected for uploading')
#         return redirect('upload')
#     else:
#         file_ext = os.path.splitext(filename)[1]  # Extracting extension
#         if file_ext in allowed_extensions:
#             secure_fname = secure_filename(filename)
#             file_path = os.path.join(UPLOAD_PATH, secure_fname)
#             file.save(file_path)
#             flash('File uploaded successfully')
#             read_xls(file_path, JOSN_PATH)
#             return redirect('/name')
#         else:
#             flash('Not allowed file type')
#             return redirect('upload')


def create_tt(class_name):
    # add a way to check if the response cnotains all the expected parameters
    # if len(class_name.split('-')) == 0:
    #     return None
    # xls_path = os.path.join(JOSN_PATH, class_name.upper()+'.json')
    # try:
    #     with open(xls_path, 'r') as f:
    #         res = json.load(f)
    # except:
    #     res = {'Not Found': 'Upload it'}
    # data = res
    
    #class_name of form dept_year_sec
    
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
