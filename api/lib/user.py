import uuid


class User:
    def __init__(self):
        self.id = uuid.uuid4()
        self.frames = []
        self.detected_index = 0
