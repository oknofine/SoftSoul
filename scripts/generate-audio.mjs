import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { meditations } from "./meditations.mjs";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("缺少 OPENAI_API_KEY。请先设置 OpenAI API Key，再运行 npm run audio:generate");
  process.exit(1);
}

const root = process.cwd();
const audioDir = path.join(root, "public", "audio");
fs.mkdirSync(audioDir, { recursive: true });

const instructions = "成年男性中文冥想引导。自然、低刺激、温柔、可靠、亲近，不要播音腔，不要戏剧化，不要过度情绪化。语速偏慢，约每分钟90到110个汉字。句子之间保留明显停顿。像一个安静的人陪伴练习者，而不是老师讲课。不要命令练习者改变呼吸或强迫放松。MBCT导向：强调觉察、允许、去中心化、注意力温柔地回来。";

for (const item of meditations) {
  const out = path.join(audioDir, item.file);
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "cedar",
      input: item.text,
      instructions,
      response_format: "mp3",
      speed: 0.82,
    }),
  });
  if (!response.ok) throw new Error(`${item.file}: ${response.status} ${await response.text()}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(out, buffer);
  console.log(`已生成 ${item.file}`);
}

console.log("6条冥想人声已生成到 public/audio/。");
console.log("提示：首次发布时请在产品页面明确说明声音由AI生成。");
