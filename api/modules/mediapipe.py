import mediapipe as mp
import cv2


def detect_five_fingers(frames, detector, idx):
    """Detects five fingers in the image.

    Args:
        frames (np.array): The nd images array to detect the five fingers in.

    Returns:
        (bool): True if five fingers are detected, False otherwise.
    """
    hands, frame = detector.findHands(frames)
    if hands:
        fingers1 = detector.fingersUp(hands[0])
        totalFingers = fingers1.count(1)
        print(totalFingers)

    return len(frames)
