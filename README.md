# SoftSoul V0.1

这是一个手机优先的 SoftSoul MVP：
- 6 个状态
- 6 种冥想技术
- 状态到技术的规则推荐
- 8 分钟练习体验
- 冥想引导文字
- 背景氛围音播放器（占位）
- 练习完成反馈
- 本地练习记录（localStorage）
- 无需数据库、无需 API Key 即可运行

## 安装
在项目目录运行：

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000

## 替换音频
把正式音频放到：

`public/audio/softsoul-ambient.mp3`

如果以后要做每种技术独立的人声，只需把播放器从单一文件扩展成：
`breath.mp3 / body.mp3 / grounding.mp3 / thoughts.mp3 / open.mp3 / kindness.mp3`

当前版本没有联网 AI；推荐逻辑是安全、可解释的规则系统。后续可把自然语言理解接入 API，但 AI 只负责把用户表达映射到 6 个状态和 6 个技术，不允许自行发明冥想方法。
