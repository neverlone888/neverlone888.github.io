# 个人简历网站（仿 CTF 平台风格）

这是一个深色科技风的个人简历网站，使用 **Vite + React + TypeScript** 构建。

**特点：**
- 仿 CTF 平台的深色终端风格（网格背景、霓虹光效、终端标签）
- 首页打字机效果、滚动渐入动画
- 项目作品区有 **2 个可打开体验的项目**：贪吃蛇游戏、爬虫项目
- 内置音乐播放器（默认歌曲：泽野弘之《Call of Silence》）
- 所有用户数据保存在浏览器 localStorage（音量、最高分、访问次数）

---

## 一、如何启动项目

1. 打开终端，进入项目文件夹：
   ```bash
   cd D:\个人网站
   ```
2. 启动开发服务器：
   ```bash
   npm run dev
   ```
3. 浏览器打开提示的网址（通常是 http://localhost:5173/，被占用时会自动换端口）

## 二、如何停止项目

在运行项目的终端按 `Ctrl + C`，输入 `y` 回车。

## 三、如何重新打开项目

重复上面的「启动项目」步骤即可，不需要重新安装依赖。

## 四、音乐怎么设置（重要）

网站内置了音乐播放器，默认播放《Call of Silence》（泽野弘之）。

请把你**合法获取**的 MP3 文件放到：

```
public/music/call-of-silence.mp3
```

文件名必须是 `call-of-silence.mp3`。放好后刷新网站，点击右下角的唱片按钮即可播放。
（可用 QQ音乐 / 网易云等平台下载；没有放文件时，网站也能正常运行，只是没有音乐。）

## 五、如何修改个人资料

所有文字内容都在 `src/data/profile.ts`，直接改引号里的文字即可。

## 六、项目结构

```
个人网站/
├── public/music/              # 放音乐文件（call-of-silence.mp3）
├── projects/
│   └── crawler/               # 爬虫项目（Python 完整版代码）
├── src/
│   ├── data/profile.ts        # ★ 个人资料（改这里）
│   ├── components/            # 页面组件（导航/首屏/简历/经历/项目/联系/页脚/音乐）
│   ├── projects/
│   │   ├── SnakeGame.tsx      # 贪吃蛇游戏
│   │   └── CrawlerDemo.tsx    # 爬虫演示页
│   ├── utils/storage.ts       # localStorage 工具
│   ├── App.tsx                # 页面入口
│   ├── App.css / index.css    # 样式
│   └── main.tsx               # 启动文件
├── .gitignore / .npmrc / package.json / vite.config.ts ...
└── README.md
```

## 七、常用命令

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 打包正式版本（生成到 dist/） |
| `npm run preview` | 预览打包后的版本 |
| `npm run lint` | 检查代码规范 |

## 八、备注

- `.npmrc` 配置了国内镜像源 `registry.npmmirror.com`，加速依赖下载，只影响本项目。
- 爬虫演示版通过公开 API 实现；Python 完整版见 `projects/crawler/crawler.py`。
