from flask import Flask

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/hello", methods=["GET"])
def hello_world():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(port=5328)
