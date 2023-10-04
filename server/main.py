from flask import Flask, request, jsonify

app = Flask(__name__)

# TODO
# Create response endpoint
# send json as resonse

# make file upload
# read from excel file


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
