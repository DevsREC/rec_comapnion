import os.path
from flask import Flask, render_template, request, redirect, flash, jsonify
from werkzeug.utils import secure_filename
 
app = Flask(__name__)
app.secret_key = "secret"


allowed_extensions = ['.xlsx']

UPLOAD_PATH = os.path.join(os.getcwd(), 'timetable_upload')

# TODO
# Create response endpoint
# send json as repsonse

# make file upload - Done
# read from excel file

@app.route('/upload', methods = ['GET'])
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
        file_ext = os.path.splitext(filename)[1]        #Extracting extension
        if file_ext in allowed_extensions:
            secure_fname = secure_filename(filename)
            file.save(os.path.join(UPLOAD_PATH, secure_fname))
            flash('File uploaded successfully')
            return redirect('name')
        else:
            flash('Not allowed file type')
            return redirect('upload')
 

def create_tt():
    # TODO add parameters
    # add a way to check if the response cnotains all the expected parameters

    # debug #
    days = ['Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday', 'Sunday']
    time = "20231004"
    class_name = "5-it-b"  # sem dep sec
    classes = {
        days[0]: [
            ["ITA1581", "ComputerNetwork"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[1]: [

            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[2]: [

            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[3]: [
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[4]: [
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[5]: [
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["break", "break"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
            ["Lunch", "Lunch"],
            ["ITA1581", "ComputerNetworks"],
            ["ITA1581", "ComputerNetworks"],
        ],
        days[6]: [
            ["Why", "did"],
            ["you", "join"],
            ["break", "break"],
            ["this", "clg"],
            ["da", "sunday"],
            ["class", "ku"],
            ["Lunch", "Lunch"],
            ["coming", ":("],
            ["L", "L"],
        ]
    }
    ######

    data = {
        "last_updated": time,
        "class_name": class_name,
        "classes": classes
    }

    data = jsonify(data)
    return data


@app.route("/<name>", methods=['GET', 'POST'])
def hello_world(name):
    # get api method
    if request.method == 'GET':

        data = create_tt()
        if data:
            return data
        else:
            return "Error"

    if request.method == 'POST':
        return "POST REQ recieved"


if __name__ == "__main__":
    # app.run()
    app.run(host='0.0.0.0', port=5000, debug=True)
