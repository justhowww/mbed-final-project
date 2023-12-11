from io import BytesIO
import cv2
from flask import Flask, render_template
from flask_cors import CORS
from flask_socketio import SocketIO
import imageio.v3 as iio
from cvzone.HandTrackingModule import HandDetector
from modules.mediapipe import detect_five_fingers
from lib.user import User


app = Flask(__name__)
video_bytes = b""
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:3000"],
    logger=False,
    engineio_logger=False,
    max_http_buffer_size=100000000,
)
detector = HandDetector(detectionCon=0.5, maxHands=1)
users = {}
idx = 0


@socketio.on("stream")
def handle_video_frame(frame_data):
    global video_bytes, out, idx
    video_bytes += frame_data
    frame = iio.imread(video_bytes)[-1]
    idx = detect_five_fingers(frame, detector, idx)

    # print("Received video frame:", frame_data)


@socketio.on("connect")
def connect():
    print("connected")
    global video_bytes, idx
    video_bytes = b""
    user = User()
    users[user.id] = user
    idx = 0


@socketio.on("disconnect")
def disconnect():
    global video_bytes, idx
    video_bytes = b""
    idx = 0


if __name__ == "__main__":
    socketio.run(app, use_reloader=True, log_output=False, port=5329)
