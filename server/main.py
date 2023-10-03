from flask import Flask

app = Flask(__name__)

# TODO
# Create response endpoint
# send json as resonse

# make file upload
# read from excel file


@app.route("/")
def hello_world():
    return "<p>Hello, World! </p>"


if __name__ == "__main__":
    # app.run()
    app.run(host='0.0.0.0', port=5000, debug=True)
