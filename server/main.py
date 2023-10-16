import os.path
import pandas as pd
import json
from flask import Flask, render_template, request, redirect, flash, jsonify
from werkzeug.utils import secure_filename

from fun.read_xlsx import read_xls

app = Flask(__name__)
app.secret_key = "secret"


allowed_extensions = ['.xlsx']

UPLOAD_PATH = os.path.join(os.getcwd(), 'timetable_upload')
JOSN_PATH = os.path.join(os.getcwd(), 'timetable_upload/json')

# TODO
# Create response endpoint

# make file upload - Done
# read from excel file - Done


@app.route('/upload', methods=['GET'])
def index():
    return render_template('upload.html')


@app.route('/upload', methods=['POST'])
def upload_files():
    if 'file' not in request.files:
        flash('No file part')
        return redirect('upload')

    file = request.files['file']
    # obtaining the name of the destination file
    filename = file.filename
    if filename == '':
        flash('No file selected for uploading')
        return redirect('upload')
    else:
        file_ext = os.path.splitext(filename)[1]  # Extracting extension
        if file_ext in allowed_extensions:
            secure_fname = secure_filename(filename)
            file_path = os.path.join(UPLOAD_PATH, secure_fname)
            file.save(file_path)
            flash('File uploaded successfully')
            read_xls(file_path, JOSN_PATH)
            return redirect('/name')
        else:
            flash('Not allowed file type')
            return redirect('upload')


def create_tt(class_name):
    # add a way to check if the response cnotains all the expected parameters
    if len(class_name.split('-')) == 0:
        return None
    xls_path = os.path.join(JOSN_PATH, class_name.upper()+'.json')
    try:
        with open(xls_path, 'r') as f:
            res = json.load(f)
    except:
        res = {'Not Found': 'Upload it'}
    data = res

    data = jsonify(data)
    return data


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
