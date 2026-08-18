import { useCallback, useEffect, useRef, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const GRID = 20;          // 棋盘 20 x 20
const CELL = 20;          // 每格像素
const CANVAS = GRID * CELL;

interface Point { x: number; y: number; }
type Dir = "up" | "down" | "left" | "right";

const DIRS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

/** 贪吃蛇：Canvas 实现，键盘 + 屏幕按钮控制，最高分存 localStorage */
export default function SnakeGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const speedRef = useRef(140);
  const scoreRef = useRef(0);
  const highRef = useRef<number>(loadFromStorage("snakeHighScore", 0));

  const [score, setScore] = useState(0);
  const [high, setHigh] = useState<number>(highRef.current);
  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const statusRef = useRef(status);

  useEffect(() => { statusRef.current = status; }, [status]);

  /** 生成一个不在蛇身上的食物位置 */
  const spawnFood = useCallback((snake: Point[]): Point => {
    const free: Point[] = [];
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
      }
    }
    return free.length ? free[Math.floor(Math.random() * free.length)] : { x: -1, y: -1 };
  }, []);

  /** 绘制画面 */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);

    // 食物（红色发光圆点）
    ctx.fillStyle = "#ff4d6d";
    ctx.shadowColor = "#ff4d6d";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(foodRef.current.x * CELL + CELL / 2, foodRef.current.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();

    // 蛇身
    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00ffd1" : "#0f8f7a";
      ctx.shadowColor = "#00ffd1";
      ctx.shadowBlur = i === 0 ? 12 : 4;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 5);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  /** 重置游戏 */
  const reset = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = "right";
    nextDirRef.current = "right";
    speedRef.current = 140;
    scoreRef.current = 0;
    setScore(0);
    foodRef.current = spawnFood(snakeRef.current);
    setStatus("idle");
    draw();
  }, [draw, spawnFood]);

  /** 走一步 */
  const step = useCallback(() => {
    const snake = snakeRef.current;
    const dir = (dirRef.current = nextDirRef.current);
    const head = { x: snake[0].x + DIRS[dir].x, y: snake[0].y + DIRS[dir].y };

    const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
    const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
    if (hitWall || hitSelf) {
      setStatus("over");
      return;
    }

    snake.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (scoreRef.current > highRef.current) {
        highRef.current = scoreRef.current;
        setHigh(highRef.current);
        saveToStorage("snakeHighScore", highRef.current);
      }
      foodRef.current = spawnFood(snake);
      speedRef.current = Math.max(70, speedRef.current - 4); // 越吃越快
    } else {
      snake.pop();
    }
    draw();
  }, [draw, spawnFood]);

  /** 开始 / 继续 */
  const start = useCallback(() => {
    if (statusRef.current === "over") reset();
    setStatus("running");
  }, [reset]);

  /** 主循环 */
  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(step, speedRef.current);
    return () => clearInterval(timer);
  }, [status, step]);

  /** 键盘控制 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        if (statusRef.current === "running") {
          if (d !== OPPOSITE[dirRef.current]) nextDirRef.current = d;
        } else {
          nextDirRef.current = d;
          start();
        }
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (statusRef.current === "idle") start();
        else if (statusRef.current === "over") reset();
        else setStatus("idle");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, reset]);

  /** 首次绘制 */
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 屏幕按钮方向控制 */
  const pressDir = (d: Dir) => {
    if (statusRef.current === "running") {
      if (d !== OPPOSITE[dirRef.current]) nextDirRef.current = d;
    } else {
      nextDirRef.current = d;
      start();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">贪吃蛇游戏</h1>
        <button className="back-btn" onClick={onBack}>← 返回首页</button>
      </div>

      <div className="snake-wrap">
        <canvas ref={canvasRef} width={CANVAS} height={CANVAS} className="snake-canvas" />

        <div className="snake-info">
          <span>得分 <b>{score}</b></span>
          <span>最高 <b>{high}</b></span>
        </div>

        <div className="snake-controls">
          <button className="btn btn-primary" onClick={() => { if (status === "over") reset(); else if (status === "running") setStatus("idle"); else start(); }}>
            {status === "idle" ? "▶ 开始" : status === "running" ? "⏸ 暂停" : "↻ 重新开始"}
          </button>
        </div>

        <div className="snake-controls">
          <button className="btn btn-ghost" onClick={() => pressDir("up")}>↑</button>
        </div>
        <div className="snake-controls">
          <button className="btn btn-ghost" onClick={() => pressDir("left")}>←</button>
          <button className="btn btn-ghost" onClick={() => pressDir("down")}>↓</button>
          <button className="btn btn-ghost" onClick={() => pressDir("right")}>→</button>
        </div>

        <p className="snake-hint">方向键 / WASD 控制方向，空格或回车开始 / 暂停。最高分保存在浏览器本地。</p>
      </div>
    </div>
  );
}

