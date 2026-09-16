# SoftSoul 音频

项目已经接好 6 条冥想音频的播放接口。

## 生成 AI 人声

OpenAI 的语音 API 与 ChatGPT 订阅分开计费。准备好 API Key 后，在项目根目录运行：

```bash
export OPENAI_API_KEY="你的API Key"
npm run audio:generate
```

6 条 MP3 会自动进入 `public/audio/`，网页无需改代码。

当前脚本使用 `gpt-4o-mini-tts`，并通过 instructions 控制为自然、低刺激、成年男性冥想引导风格；以后你录制自己的声音，只需要用同名 MP3 替换即可。
