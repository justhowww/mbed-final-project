import cv2
from flask import Flask, render_template
from flask_cors import CORS
from flask_socketio import SocketIO


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:3000"],
    logger=False,
    engineio_logger=False,
)


@socketio.on("connect")
def connect():
    pass


@socketio.on("disconnect")
def disconnect():
    pass


if __name__ == "__main__":
    socketio.run(app, use_reloader=True, log_output=False, port=5328)
