"use client";

import { useEffect, useRef, useState } from "react";
import Dog from "@/components/Dog";
import EmailField from "./EmailField";

const TOPICS = ["일반 문의", "제휴·협력", "언론·취재", "복지관·기관"];

export default function ContactForm() {
  const [f, setF] = useState<Record<string, string>>({ topic: "" });
  const [privacy, setPrivacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data: { ...f, privacy }, website: f.website || "", startedAt: startedAt.current }),
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || "보내지 못했습니다.");
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <div className="text-center" role="status">
        <Dog pose="thumb" motion="bounce" className="mx-auto h-36 w-36" />
        <p className="mt-6 text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold tracking-[-0.03em] text-paper">문의를 잘 받았습니다.</p>
        <p className="mt-3 text-[1.125rem] text-paper/70">보내 주신 이메일로 답장드리겠습니다.</p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-7">
      <fieldset>
        <legend className="mb-3 text-[1.0625rem] font-semibold text-paper">
          문의 유형 <span className="text-tap">*</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="문의 유형">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={f.topic === t}
              onClick={() => setF((p) => ({ ...p, topic: t }))}
              className={`chip ${f.topic === t ? "chip--on" : ""}`}
            >
              <span aria-hidden className="chip-check">✓</span>
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5">
        <label className="block">
          <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
            이름 <span className="text-tap">*</span>
          </span>
          <input className="field" autoComplete="name" value={f.name || ""} onChange={set("name")} />
        </label>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[1.0625rem] font-semibold text-paper">
            이메일 <span className="text-tap">*</span>
          </label>
          <EmailField id="contact-email" value={f.email || ""} onChange={(v) => setF((p) => ({ ...p, email: v }))} />
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
          문의 내용 <span className="text-tap">*</span>
        </span>
        <textarea className="field min-h-44 py-4" value={f.message || ""} onChange={set("message")} />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website || ""} onChange={set("website")} />
      <label className="check">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
        <span>
          <b>개인정보 수집·이용에 동의합니다.</b> <span className="text-tap">*</span>
          <span className="mt-1 block text-[0.9375rem] text-paper/60">
            이름·이메일·문의 내용을 답변에만 쓰고 답변 후 1년 안에 파기합니다.{" "}
            <a href="/privacy" target="_blank" className="underline underline-offset-4">
              자세히
            </a>
          </span>
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-[18px] border border-tap/40 bg-tap/10 p-4 text-[1.0625rem] text-paper">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-16 items-center justify-center rounded-full bg-paper text-[1.1875rem] font-extrabold text-forest disabled:opacity-60"
      >
        {busy ? "보내는 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
