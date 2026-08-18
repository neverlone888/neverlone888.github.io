# -*- coding: utf-8 -*-
"""
人脸识别 + 动作捕捉 + 手势识别（Python + OpenCV 完整版）
========================================================
依赖安装：
    pip install opencv-python numpy

运行：
    python face_gesture.py

按键切换模式：
    1  人脸识别
    2  动作捕捉（帧差法）
    3  手势识别（肤色分割 + 凸包缺陷数手指）
    ESC 退出
"""

import cv2
import numpy as np

# 人脸检测级联模型（OpenCV 自带）
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

mode = 1
prev_gray = None

cap = cv2.VideoCapture(0)  # 0 表示默认摄像头
if not cap.isOpened():
    print("无法打开摄像头")
    exit(1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)  # 镜像，方便观察
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    if mode == 1:
        # ---------- 人脸识别（Haar 级联） ----------
        faces = face_cascade.detectMultiScale(gray, 1.1, 3, minSize=(60, 60))
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 209), 2)
            cv2.putText(frame, "FACE", (x, y - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 209), 2)

    elif mode == 2:
        # ---------- 动作捕捉（帧差法） ----------
        if prev_gray is None:
            prev_gray = gray
            continue
        diff = cv2.absdiff(gray, prev_gray)
        _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            if cv2.contourArea(c) > 1500:
                x, y, w, h = cv2.boundingRect(c)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (77, 124, 255), 2)
        prev_gray = gray.copy()

    elif mode == 3:
        # ---------- 手势识别（肤色分割 + 凸包缺陷数手指） ----------
        ycrcb = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
        mask = cv2.inRange(ycrcb, (0, 133, 77), (255, 173, 127))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            hand = max(contours, key=cv2.contourArea)
            if cv2.contourArea(hand) > 4000:
                hull = cv2.convexHull(hand, returnPoints=False)
                fingers = 1
                if len(hull) > 3:
                    defects = cv2.convexityDefects(hand, hull)
                    if defects is not None:
                        (_, _), radius = cv2.minEnclosingCircle(hand)
                        for i in range(defects.shape[0]):
                            _, _, _, depth = defects[i, 0]
                            if depth / 256 > radius * 0.25:
                                fingers += 1
                cv2.drawContours(frame, [hand], -1, (0, 255, 209), 2)
                cv2.putText(frame, "HAND fingers: %d" % min(fingers, 5),
                            (12, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                            (0, 255, 209), 2)

    cv2.imshow("OpenCV Vision", frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord("1"):
        mode = 1
    elif key == ord("2"):
        mode = 2
    elif key == ord("3"):
        mode = 3
    elif key == 27:  # ESC
        break

cap.release()
cv2.destroyAllWindows()