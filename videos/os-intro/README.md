# 操作系统入门动画

159 秒 · 1920×1080 · 30fps · 黑底荧光绿科技风。

## 文件

- `operating-system.mp4`：导出的 H.264 / AAC 成片。
- `src/`：八段动画及完整时间轴。
- `public/original-audio.m4a`：用户提供的原音频。
- `public/preview-audio.wav`：同一内容的兼容播放版本。
- `poster.png`：预览封面。
- `制作说明.md`：内容、分镜与音频说明。

音频按用户要求直接沿用 GitHub 参考音频，画面独立介绍操作系统；屏幕文字不是音频转写字幕。

## 预览与导出

在 `os` 目录运行：

```sh
npm ci
npm run dev
```

选择 `OperatingSystem`，点击播放按钮。`Scenes` 可单独查看各章节。

重新导出：

```sh
npm run render
```

检查源码：

```sh
npm run lint
```

`node_modules`、构建缓存不纳入 Git；源码、音频和成片保存在此目录。
