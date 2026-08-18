import { useEffect, useRef, useState } from "react";
import { flags } from "../data/flags";
import { toast } from "../utils/toast";

type Mode = "face" | "motion" | "gesture";

const MODE_LABEL: Record<Mode, string> = {
  face: "人脸识别",
  motion: "动作捕捉",
  gesture: "手势识别",
};

let cvPromise: Promise<void> | null = null;

/** 加载 OpenCV.js（脚本标签方式，避免打包问题；只加载一次） */
function loadOpenCV(): Promise<void> {
  if (!cvPromise) {
    cvPromise = new Promise<void>((resolve, reject) => {
      const w = window as any;
      if (w.cv && w.cv.Mat) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = "/opencv/opencv.js";
      s.async = true;
      s.onload = () => {
        w.cv.onRuntimeInitialized = () => resolve();
      };
      s.onerror = () => {
        cvPromise = null;
        reject(new Error("OpenCV.js 加载失败"));
      };
      document.body.appendChild(s);
    });
  }
  return cvPromise;
}

/** 视觉识别项目：人脸识别 / 动作捕捉 / 手势识别（OpenCV.js + 摄像头） */
export default function VisionDemo({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef(0);
  const cascadeRef = useRef<any>(null);
  const prevGrayRef = useRef<any>(null);
  const flagShownRef = useRef(false);
  const modeRef = useRef<Mode>("face");
  const runningRef = useRef(false);
  const fpsRef = useRef(0);

  const [mode, setMode] = useState<Mode>("face");
  const [running, setRunning] = useState(false);
  const [cvReady, setCvReady] = useState(false);
  const [flagFound, setFlagFound] = useState(false);
  const [status, setStatus] = useState("OpenCV.js 正在加载（约 10MB，请稍候）...");
  const [fps, setFps] = useState(0);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  /** 停止摄像头并清理 */
  const stopCamera = () => {
    runningRef.current = false;
    setRunning(false);
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setStatus("已停止。");
  };

  /** 加载 OpenCV + 人脸级联模型 */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadOpenCV();
        if (cancelled) return;
        const cv: any = (window as any).cv;
        const res = await fetch("/opencv/haarcascade_frontalface_default.xml");
        const xml = await res.text();
        const bytes = new TextEncoder().encode(xml);
        cv.FS_createDataFile("/", "haarcascade_frontalface_default.xml", new Uint8Array(bytes), true, false, false);
        cascadeRef.current = new cv.CascadeClassifier();
        const ok = cascadeRef.current.load("haarcascade_frontalface_default.xml");
        if (!ok) throw new Error("人脸级联模型加载失败");
        setCvReady(true);
        setStatus("OpenCV.js 就绪。选择模式后点击“启动摄像头”。");
      } catch (err) {
        setStatus("初始化失败：" + (err instanceof Error ? err.message : String(err)));
        toast("OpenCV 初始化失败", "error");
      }
    })();
    return () => {
      cancelled = true;
      stopCamera();
      if (cascadeRef.current) cascadeRef.current.delete();
      if (prevGrayRef.current) prevGrayRef.current.delete();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 人脸识别：Haar 级联检测，画出人脸框并触发 flag */
  const processFace = (cv: any, gray: any, ctx: CanvasRenderingContext2D) => {
    const cascade = cascadeRef.current;
    if (!cascade) return;
    const faces = new cv.RectVector();
    cascade.detectMultiScale(gray, faces, 1.1, 3, 0, new cv.Size(60, 60));
    ctx.strokeStyle = "#00ffd1";
    ctx.lineWidth = 3;
    for (let i = 0; i < faces.size(); i++) {
      const r = faces.get(i);
      ctx.strokeRect(r.x, r.y, r.width, r.height);
      ctx.fillStyle = "rgba(0,255,209,0.9)";
      ctx.font = "14px Consolas, monospace";
      ctx.fillText("FACE", r.x, r.y - 6);
      if (!flagShownRef.current) {
        flagShownRef.current = true;
        setFlagFound(true);
        setStatus("🎯 检测到人脸！发现 flag：" + flags.vision);
        toast("🎉 人脸识别成功！发现 flag", "success");
      }
    }
    faces.delete();
  };

  /** 动作捕捉：帧差法找出运动区域 */
  const processMotion = (cv: any, gray: any, ctx: CanvasRenderingContext2D) => {
    if (!prevGrayRef.current) {
      prevGrayRef.current = gray.clone();
      return;
    }
    const diff = new cv.Mat();
    cv.absdiff(gray, prevGrayRef.current, diff);
    const thresh = new cv.Mat();
    cv.threshold(diff, thresh, 30, 255, cv.THRESH_BINARY);
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    cv.morphologyEx(thresh, thresh, cv.MORPH_OPEN, kernel);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let count = 0;
    ctx.strokeStyle = "#4d7cff";
    ctx.lineWidth = 2;
    for (let i = 0; i < contours.size(); i++) {
      const area = cv.contourArea(contours.get(i));
      if (area > 1500) {
        const rect = cv.boundingRect(contours.get(i));
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        count++;
      }
    }
    ctx.fillStyle = "#4d7cff";
    ctx.font = "14px Consolas, monospace";
    ctx.fillText("MOTION x" + count, 12, 24);
    prevGrayRef.current.delete();
    prevGrayRef.current = gray.clone();
    kernel.delete();
    diff.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  };

  /** 手势识别：肤色分割 + 凸包缺陷数手指 */
  const processGesture = (cv: any, src: any, ctx: CanvasRenderingContext2D) => {
    const ycc = new cv.Mat();
    cv.cvtColor(src, ycc, cv.COLOR_RGBA2YCrCb);
    const mask = new cv.Mat();
    cv.inRange(ycc, new cv.Scalar(0, 133, 77), new cv.Scalar(255, 173, 127), mask);
    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(9, 9));
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel);
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let handIdx = -1;
    let maxArea = 0;
    for (let i = 0; i < contours.size(); i++) {
      const a = cv.contourArea(contours.get(i));
      if (a > maxArea) {
        maxArea = a;
        handIdx = i;
      }
    }

    if (handIdx >= 0 && maxArea > 4000) {
      const contour = contours.get(handIdx);
      // 画出手部轮廓
      ctx.strokeStyle = "#00ffd1";
      ctx.lineWidth = 3;
      ctx.beginPath();
      const data = contour.data32S;
      for (let i = 0; i < contour.rows; i++) {
        const x = data[i * 2];
        const y = data[i * 2 + 1];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      const hullIdx = new cv.Mat();
      cv.convexHull(contour, hullIdx, false, true);
      let fingers = 1;
      if (hullIdx.rows > 3) {
        const defects = new cv.Mat();
        cv.convexityDefects(contour, hullIdx, defects);
        const circle = new cv.Mat();
        cv.minEnclosingCircle(contour, circle);
        const radius = circle.data32F[2];
        for (let i = 0; i < defects.rows; i++) {
          const d = defects.row(i).data32S;
          const depth = d[3] / 256;
          if (depth > radius * 0.25) fingers++;
        }
        circle.delete();
        defects.delete();
      }
      hullIdx.delete();
      contour.delete();

      ctx.fillStyle = "#ff4d6d";
      ctx.font = "16px Consolas, monospace";
      ctx.fillText("HAND · 手指: " + Math.min(fingers, 5), 12, 24);
    }

    ycc.delete();
    mask.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();
  };

  /** 每一帧：把摄像头画面画到画布，再用 OpenCV 处理 */
  const step = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cv: any = (window as any).cv;
    if (!video || !canvas || !cv) {
      animRef.current = requestAnimationFrame(step);
      return;
    }
    if (video.readyState < 2) {
      animRef.current = requestAnimationFrame(step);
      return;
    }
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (canvas.width !== vw) canvas.width = vw;
    if (canvas.height !== vh) canvas.height = vh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animRef.current = requestAnimationFrame(step);
      return;
    }
    ctx.drawImage(video, 0, 0, vw, vh);

    const t0 = performance.now();
    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    try {
      if (modeRef.current === "face") processFace(cv, gray, ctx);
      else if (modeRef.current === "motion") processMotion(cv, gray, ctx);
      else processGesture(cv, src, ctx);
    } finally {
      src.delete();
      gray.delete();
    }
    const dt = performance.now() - t0;
    fpsRef.current = fpsRef.current * 0.9 + (1000 / Math.max(1, dt)) * 0.1;
    const f = Math.round(fpsRef.current);
    if (f !== fps) setFps(f);

    if (runningRef.current) animRef.current = requestAnimationFrame(step);
  };

  /** 启动摄像头 */
  const startCamera = async () => {
    const w = window as any;
    if (!w.cv || !cascadeRef.current) {
      toast("OpenCV 尚未就绪，请稍候", "error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      runningRef.current = true;
      setRunning(true);
      setStatus("运行中：" + MODE_LABEL[modeRef.current] + "（切换模式即时生效）");
      animRef.current = requestAnimationFrame(step);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus("无法访问摄像头：" + msg);
      toast("摄像头启动失败，请检查浏览器权限", "error");
    }
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    setStatus("运行中：" + MODE_LABEL[m] + "（切换模式即时生效）");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">人脸识别 · 动作捕捉 · 手势识别</h1>
        <button className="back-btn" onClick={onBack}>← 返回首页</button>
      </div>

      <div className="vision-wrap">
        <div className="vision-modes">
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <button
              key={m}
              className={"btn " + (mode === m ? "btn-primary" : "btn-ghost")}
              onClick={() => changeMode(m)}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>

        <div className="vision-stage">
          <video ref={videoRef} playsInline muted className="vision-video" />
          <canvas ref={canvasRef} className="vision-canvas" />
          {!running && (
            <div className="vision-placeholder">
              {cvReady ? "选择模式后点击「启动摄像头」" : status}
            </div>
          )}
          <div className="vision-fps">FPS {fps}</div>
        </div>

        <div className="vision-actions">
          {running ? (
            <button className="btn btn-danger" onClick={stopCamera}>⏹ 停止摄像头</button>
          ) : (
            <button className="btn btn-primary" onClick={startCamera} disabled={!cvReady}>
              ▶ 启动摄像头
            </button>
          )}
        </div>

        {flagFound && (
          <p className="flag-found">🎯 发现 flag：<b>{flags.vision}</b> —— 回首页项目卡片提交解锁成就！</p>
        )}

        <p className="vision-status">{status}</p>

        <div className="note-box">
          💡 说明：本页使用 <b>OpenCV.js</b>（OpenCV 官方浏览器版）实时处理摄像头画面：人脸识别（Haar 级联）、
          动作捕捉（帧差法）、手势识别（肤色分割 + 凸包缺陷数手指）。首次打开需要允许浏览器使用摄像头。
          完整 Python 代码在 <b>projects/opencv/face_gesture.py</b>。
        </div>
      </div>
    </div>
  );
}