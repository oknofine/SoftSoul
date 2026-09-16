"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StateKey = "焦虑" | "脑子停不下来" | "睡不着" | "很累" | "烦躁" | "无法专注";
type Practice = {
  title: string;
  english: string;
  technique: string;
  duration: number;
  intro: string;
  audio: string;
};

const states: { key: StateKey; subtitle: string }[] = [
  { key: "焦虑", subtitle: "心里有点紧，停不下来" },
  { key: "脑子停不下来", subtitle: "想法一个接一个" },
  { key: "睡不着", subtitle: "身体累，脑子还醒着" },
  { key: "很累", subtitle: "只想先喘口气" },
  { key: "烦躁", subtitle: "一点小事都容易被触动" },
  { key: "无法专注", subtitle: "注意力总是被带走" },
];

const practices: Record<StateKey, Practice> = {
  焦虑: { title: "把注意力带回呼吸", english: "RETURN TO THE BREATH", technique: "呼吸觉察 · Breath Awareness", duration: 8, intro: "不需要马上消除焦虑。先给当下留一点空间。", audio: "/audio/anxiety-breath-awareness.mp3" },
  "脑子停不下来": { title: "看见念头，而不是跟着它走", english: "WATCH THE THOUGHTS", technique: "念头观察 · Thought Observation", duration: 10, intro: "不用把脑子清空，只练习看见念头正在发生。", audio: "/audio/thought-observation.mp3" },
  睡不着: { title: "让身体先慢下来", english: "REST IN THE BODY", technique: "身体扫描 · Body Scan", duration: 15, intro: "今晚不需要逼自己睡着，先让身体得到休息。", audio: "/audio/sleep-body-scan.mp3" },
  很累: { title: "先什么都不用做", english: "JUST BE HERE", technique: "身体扫描 · Body Scan", duration: 8, intro: "你已经做了很多。现在可以暂时不用解决任何事情。", audio: "/audio/rest-body-scan.mp3" },
  烦躁: { title: "回到你正在感受的世界", english: "COME BACK TO THE SENSES", technique: "感官锚定 · Grounding", duration: 8, intro: "不一定要想通。先回到声音、触感和此刻。", audio: "/audio/grounding.mp3" },
  无法专注: { title: "一次，只做一件事", english: "ONE THING AT A TIME", technique: "呼吸觉察 · Breath Awareness", duration: 10, intro: "专注不是不走神，而是一次又一次温柔地回来。", audio: "/audio/focus-breath-awareness.mp3" },
};

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export default function Home() {
  const [selected, setSelected] = useState<StateKey | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.9);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const practice = useMemo(() => (selected ? practices[selected] : null), [selected]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => { setDuration(audio.duration || 0); setAudioReady(true); };
    const onEnded = () => { setPlaying(false); setFinished(true); setCurrentTime(audio.duration || currentTime); };
    const onError = () => { setAudioReady(false); setPlaying(false); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [started, currentTime]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const selectState = (state: StateKey) => {
    setSelected(state); setStarted(false); setPlaying(false); setFinished(false); setFeedback(null); setCurrentTime(0); setDuration(0);
  };

  const startPractice = () => { setStarted(true); setPlaying(false); setFinished(false); setFeedback(null); setCurrentTime(0); };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioReady) return;
    if (audio.paused) { await audio.play(); setPlaying(true); } else { audio.pause(); setPlaying(false); }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
    if (finished) setFinished(false);
  };

  const restart = () => seek(0);
  const backToStates = () => { setStarted(false); setPlaying(false); setFinished(false); setFeedback(null); setCurrentTime(0); };

  if (started && practice && selected) {
    const total = duration || practice.duration * 60;
    const progress = total ? Math.min(100, (currentTime / total) * 100) : 0;
    return (
      <main className="min-h-screen bg-[#F5F5EF] text-[#27332E]">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-10">
          <button onClick={backToStates} className="text-sm text-[#7C817C] hover:text-[#276B53]">← 回到状态</button>
          <div className="text-[19px] font-medium tracking-[0.32em] text-[#276B53]">SOFTSOUL</div>
          <div className="w-20 text-right text-sm text-[#8B918C]">{practice.duration} 分钟</div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-3xl flex-col items-center px-6 pb-12 pt-8 md:pt-14">
          <div className="text-center">
            <div className="text-[11px] tracking-[0.32em] text-[#789487] md:text-[13px]">{practice.english}</div>
            <h1 className="mt-7 font-serif text-[38px] leading-[1.3] tracking-[-0.035em] md:text-[54px]">{practice.title}</h1>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-8 text-[#7A817C] md:text-[18px]">{practice.intro}</p>
          </div>

          <div className="relative mt-10 flex h-64 w-64 items-center justify-center md:mt-14 md:h-72 md:w-72">
            <div className={`absolute h-48 w-48 rounded-full bg-[#DCE9E2] transition-all duration-[5000ms] ${playing ? "scale-125 opacity-80" : "scale-90 opacity-60"}`} />
            <div className={`absolute h-36 w-36 rounded-full bg-[#C8DDD3] transition-all duration-[5000ms] ${playing ? "scale-125 opacity-70" : "scale-90 opacity-50"}`} />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#276B53] text-center text-sm leading-6 text-white shadow-[0_15px_45px_rgba(39,107,83,0.18)]">
              {playing ? <>安静地<br />待在这里</> : finished ? <>练习<br />完成</> : <>准备好<br />了吗？</>}
            </div>
          </div>

          <div className="mt-2 text-center"><div className="text-[15px] text-[#64716A]">{practice.technique}</div><div className="mt-2 text-xs tracking-[0.12em] text-[#A0A6A1]">{selected}</div></div>

          <div className="mt-9 w-full">
            <input aria-label="冥想进度" type="range" min={0} max={total || 1} step={0.1} value={Math.min(currentTime, total || 1)} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-[#276B53]" />
            <div className="mt-1 flex justify-between text-xs text-[#929993]"><span>{formatTime(currentTime)}</span><span>{formatTime(total)}</span></div>
          </div>

          <div className="mt-7 flex items-center gap-5">
            <button onClick={restart} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8DED9] bg-white text-[#68736D]" aria-label="重新开始">↺</button>
            <button onClick={togglePlay} disabled={!audioReady} className="flex h-20 w-20 items-center justify-center rounded-full bg-[#276B53] text-2xl text-white shadow-[0_15px_35px_rgba(39,107,83,0.18)] disabled:cursor-not-allowed disabled:opacity-35" aria-label={playing ? "暂停" : "播放"}>{playing ? "Ⅱ" : "▶"}</button>
            <button onClick={backToStates} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8DED9] bg-white text-[#68736D]" aria-label="结束练习">×</button>
          </div>

          <div className="mt-5 flex items-center gap-3 text-xs text-[#929993]">音量 <input aria-label="音量" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24 accent-[#276B53]" /></div>

          {!audioReady && <div className="mt-7 rounded-2xl bg-white/80 px-5 py-4 text-center text-xs leading-6 text-[#929993]">音频还没有生成或放入项目。<br />运行项目里的 <code className="text-[#276B53]">npm run audio:generate</code> 即可生成 6 条 TTS 音频。</div>}

          {finished && (
            <div className="mt-9 w-full rounded-[28px] bg-white p-7 text-center shadow-[0_18px_50px_rgba(50,60,55,0.05)]">
              <p className="font-serif text-[24px] text-[#405048]">练习结束了。</p>
              <p className="mt-2 text-sm text-[#929993]">不需要评价自己。只是注意一下，现在的你是什么样。</p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["好一点了", "差不多", "还是有点"].map((item) => <button key={item} onClick={() => setFeedback(item)} className={`rounded-2xl border px-3 py-3 text-sm ${feedback === item ? "border-[#276B53] bg-[#276B53] text-white" : "border-[#DDE2DC] bg-[#FCFCFA] text-[#68736D]"}`}>{item}</button>)}
              </div>
              {feedback && <p className="mt-5 text-sm text-[#6E7973]">谢谢你告诉 SoftSoul。下次会更懂你一点。</p>}
              <button onClick={backToStates} className="mt-6 text-sm text-[#276B53] underline underline-offset-4">再做一次</button>
            </div>
          )}

          <div className="mt-auto pt-10 text-center text-xs leading-6 text-[#A0A6A1]">SoftSoul · 一个安静的练习空间<br />这是 AI 辅助的冥想练习，不替代医疗或心理治疗。</div>
          <audio ref={audioRef} src={practice.audio} preload="metadata" />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5EF] text-[#27332E]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-10"><div className="text-[19px] font-medium tracking-[0.32em] text-[#276B53]">SOFTSOUL</div><div className="text-sm tracking-[0.08em] text-[#858B86]">AI 冥想教练</div></header>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
        <div className="text-center"><div className="text-[11px] tracking-[0.32em] text-[#789487] md:text-[13px]">AI MEDITATION COACH</div><h1 className="mt-8 font-serif text-[46px] leading-[1.28] tracking-[-0.045em] md:text-[68px]">给此刻的你，<br />一段安静的空间。</h1><p className="mx-auto mt-7 max-w-2xl text-[16px] leading-8 text-[#737A75] md:text-[19px]">告诉我现在怎么了，SoftSoul 会帮你找到此刻最适合的练习。</p></div>
        <div className="mx-auto mt-16 max-w-5xl rounded-[38px] bg-white px-7 py-10 shadow-[0_25px_80px_rgba(50,60,55,0.06)] md:px-14 md:py-14">
          <div className="text-xs tracking-[0.2em] text-[#A0A6A1]">STEP 01</div><h2 className="mt-4 font-serif text-[30px] tracking-[-0.025em] md:text-[38px]">此刻，你是什么状态？</h2>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">{states.map((state) => { const active = selected === state.key; return <button key={state.key} onClick={() => selectState(state.key)} className={`min-h-[112px] rounded-[24px] border px-4 py-5 transition-all ${active ? "border-[#276B53] bg-[#276B53] text-white shadow-[0_12px_30px_rgba(39,107,83,0.14)]" : "border-[#DDE2DC] bg-[#FCFCFA] text-[#657069] hover:border-[#B7C6BE]"}`}><div className="text-center font-serif text-[20px] md:text-[22px]">{state.key}</div><div className={`mt-2 text-center text-xs leading-5 ${active ? "text-white/75" : "text-[#A0A6A1]"}`}>{state.subtitle}</div></button>; })}</div>
          {selected && practice && <div className="mt-10 rounded-[26px] bg-[#F6F8F5] p-6 md:p-8"><div className="text-xs tracking-[0.18em] text-[#789487]">SOFTSOUL RECOMMENDS</div><div className="mt-3 font-serif text-[25px] md:text-[30px]">{practice.technique}</div><p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#737A75]">{practice.intro}</p><div className="mt-5 flex items-center gap-4 text-xs text-[#8E9791]"><span>{practice.duration} 分钟</span><span>·</span><span>MBCT-inspired</span></div></div>}
          <button disabled={!selected} onClick={startPractice} className="mt-8 h-[72px] w-full rounded-[24px] bg-[#276B53] text-[20px] font-medium text-white transition hover:bg-[#205C46] disabled:cursor-not-allowed disabled:opacity-30">{selected ? "开始这次练习" : "先告诉我你的状态"}</button>
          <p className="mt-6 text-center text-xs leading-6 text-[#A0A6A1]">SoftSoul 不会要求你清空大脑。<br />我们只练习一次又一次地回来。</p>
        </div>
      </section>
    </main>
  );
}
