# 人脸识别 · 动作捕捉 · 手势识别（OpenCV）

## 网页演示版（在网站里直接体验）
在个人网站的「项目作品」→「人脸识别·动作捕捉·手势识别」中打开。
网页版使用 **OpenCV.js**（OpenCV 官方浏览器版）+ 摄像头，在浏览器里实时运行：

- 人脸识别：Haar 级联检测，绿色框标出人脸
- 动作捕捉：帧差法找出画面中的运动区域
- 手势识别：肤色分割 + 凸包缺陷数手指

## Python 完整版（本目录）
- `face_gesture.py` —— 使用 OpenCV（cv2）实现的完整版本

### 运行方法
1. 安装 Python（python.org 官网）
2. 安装依赖：
   ```bash
   pip install opencv-python numpy
   ```
3. 运行：
   ```bash
   python face_gesture.py
   ```
4. 按键切换：`1` 人脸识别 / `2` 动作捕捉 / `3` 手势识别 / `ESC` 退出

### 注意
- 需要电脑有摄像头
- 网页版在浏览器打开时需要允许摄像头权限（localhost 会自动允许）