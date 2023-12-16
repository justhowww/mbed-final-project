from flask_cors import CORS
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/score", methods=["POST"])
def score():
    print("score")
    return "score"


@app.route("/hello")
def hello():
    print("hello")
    return "hello"


if __name__ == "__main__":
    socketio.run(app, use_reloader=True, log_output=False, port=5328)
