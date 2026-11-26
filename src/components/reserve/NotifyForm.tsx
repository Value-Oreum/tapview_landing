"use client";

import { useEffect, useRef, useState } from "react";
import Dog from "@/components/Dog";

type Kind = "個人" | "提携";

const KINDS: { v: Kind; label: string; hint: string }[] = [
  { v: "個人", label: "リリースのお知らせ", hint: "個人の方" },
  { v: "提携", label: "提携・導入のご相談", hint: "企業・団体の方" },
];

/** 일본어 페이지: 일본 출시 알림·제휴 상담 신청 (Apps Script '일본알림' 탭에 저장) */
export default function NotifyForm() {
  const [kind, setKind] = useState<Kind>("個人");
  const [f, setF] = useState<Record<string, string>>({});
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    if (new URLSearchParams(location.search).get("type") === "partner") setKind("提携");
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const partner = kind === "提携";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    let utm = "";
    try {
      utm = sessionStorage.getItem("tv-utm") || "";
    } catch {}
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "japan",
          lang: "ja",
          data: { name: f.name, email: f.email, memo: f.memo, kind, privacy, marketing },
          utm,
          website: f.website || "",
          startedAt: startedAt.current,
        }),
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || "送信できませんでした。");
      setDone(true);
      window.scrollTo({ top: 0 });
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
        <p className="mt-6 text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold tracking-[-0.02em] text-paper">
          {partner ? "ご相談を受け付けました。" : "ご登録ありがとうございます。"}
        </p>
        <p className="mt-3 text-[1.125rem] leading-[1.7] text-paper/70">
          {partner
            ? "ご入力いただいたメールアドレスに、担当者からご連絡します。"
            : "日本でのリリースが近づきましたら、ご登録のメールアドレスにいち早くお知らせします。確認メールもお送りしました。"}
        </p>
        <a
          href="/ja"
          className="mt-8 inline-flex h-12 items-center rounded-full border border-paper/20 px-6 text-[1rem] font-semibold text-paper/85 hover:border-paper/50"
        >
          トップへ戻る
        </a>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-7">
      <fieldset>
        <legend className="mb-3 text-[1.0625rem] font-semibold text-paper">
          ご用件 <span className="text-tap">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="ご用件">
          {KINDS.map((k) => (
            <button
              key={k.v}
              type="button"
              role="radio"
              aria-checked={kind === k.v}
              onClick={() => setKind(k.v)}
              className={`rounded-[20px] border p-5 text-left transition-colors ${
                kind === k.v ? "border-mint bg-mint/10" : "border-paper/15 bg-paper/[0.03] hover:border-paper/40"
              }`}
            >
              <span className="block text-[0.875rem] font-semibold text-paper/60">{k.hint}</span>
              <span className="mt-1 block text-[1.1875rem] font-semibold text-paper">{k.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
            {partner ? "会社・団体名とお名前" : "お名前"} <span className="text-[0.875rem] font-normal text-paper/50">（任意）</span>
          </span>
          <input className="field" autoComplete={partner ? "organization" : "name"} value={f.name || ""} onChange={set("name")} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
            メールアドレス <span className="text-tap">*</span>
          </span>
          <input
            className="field"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={f.email || ""}
            onChange={set("email")}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
          {partner ? "ご相談内容" : "メモ"} <span className="text-[0.875rem] font-normal text-paper/50">（任意）</span>
        </span>
        <textarea
          className="field min-h-36 py-4"
          placeholder={partner ? "例：介護施設での導入を検討しています" : "例：母のスマホで使いたいです"}
          value={f.memo || ""}
          onChange={set("memo")}
        />
      </label>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website || ""} onChange={set("website")} />

      <label className="check">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
        <span>
          <b>個人情報の取扱いに同意します。</b> <span className="text-tap">*</span>
          <span className="mt-1 block text-[0.9375rem] text-paper/60">
            ご入力の情報は、日本でのリリースのお知らせとご相談への返信にのみ使用し、米国の事業者（Google、Vercel）のサーバーで保管します。{" "}
            <a href="/ja/privacy" target="_blank" className="underline underline-offset-4">
              詳しく
            </a>
          </span>
        </span>
      </label>
      <label className="check">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
        <span>
          <b>開発の進み具合のニュースも受け取る</b>
          <span className="mt-1 block text-[0.9375rem] text-paper/60">任意です。いつでも配信を停止できます。</span>
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
        {busy ? "送信中…" : partner ? "相談内容を送る" : "お知らせを受け取る"}
      </button>
    </form>
  );
}
