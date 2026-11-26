"use client";

import { useEffect, useRef, useState } from "react";
import { DogWalker } from "@/components/DogMotion";
import { useRouter } from "next/navigation";
import Dog from "@/components/Dog";

type Kind = "personal" | "family" | "org";

const TABS: { k: Kind; label: string; sub: string }[] = [
  { k: "personal", label: "개인", sub: "내가 쓸게요" },
  { k: "family", label: "가족 대리", sub: "부모님 대신" },
  { k: "org", label: "기관", sub: "복지관·기관" },
];

const AGES = ["45세 미만", "45~54세", "55~64세", "65~74세", "75세 이상"];
const DEVICES = ["갤럭시", "다른 안드로이드", "아이폰", "잘 모름"];
const PAINS = ["문자·카톡", "은행·송금", "병원·약국 안내", "쇼핑·성분표", "뉴스·긴 글", "사진 속 글씨"];
const SOURCES = ["복지관", "가족·지인", "검색", "SNS·유튜브", "기사", "기타"];
const RELATIONS = ["어머니", "아버지", "배우자", "기타 가족"];
const REGIONS = ["서울", "경기", "인천", "대구", "충남", "충북", "대전", "세종", "부산", "울산", "경남", "경북", "광주", "전남", "전북", "강원", "제주"];
const SIZES = ["50명 미만", "50~199명", "200~499명", "500명 이상"];
const INTERESTS = ["스마트폰 교실에서 쓰기", "복지관 전용 화면", "업무협약·시범 운영"];

function Chips({
  name,
  options,
  value,
  onChange,
  multiple = false,
}: {
  name: string;
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  const isOn = (o: string) => (multiple ? (value as string[]).includes(o) : value === o);
  const toggle = (o: string) => {
    if (multiple) {
      const arr = value as string[];
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    } else onChange(value === o ? "" : o);
  };
  return (
    <div className="flex flex-wrap gap-2" role={multiple ? "group" : "radiogroup"} aria-label={name}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role={multiple ? "checkbox" : "radio"}
          aria-checked={isOn(o)}
          onClick={() => toggle(o)}
          className={`chip ${isOn(o) ? "chip--on" : ""}`}
        >
          <span aria-hidden className="chip-check">✓</span>
          {o}
        </button>
      ))}
    </div>
  );
}

function Field({ label, req, hint, children }: { label: string; req?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[1.0625rem] font-semibold text-paper">
        {label}
        {req ? <span className="ml-1 text-tap">*</span> : <span className="ml-2 text-[0.875rem] font-normal text-paper/45">선택</span>}
      </span>
      {children}
      {hint && <span className="mt-2 block text-[0.9375rem] text-paper/50">{hint}</span>}
    </label>
  );
}

function Group({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[1.0625rem] font-semibold text-paper">
        {label}
        {req ? <span className="ml-1 text-tap">*</span> : <span className="ml-2 text-[0.875rem] font-normal text-paper/45">선택</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export default function ReserveForm() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("personal");
  const [f, setF] = useState<Record<string, string>>({});
  const [age, setAge] = useState("");
  const [device, setDevice] = useState("");
  const [pains, setPains] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [relation, setRelation] = useState("");
  const [region, setRegion] = useState("");
  const [size, setSize] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [beta, setBeta] = useState(false);
  const [storyPublic, setStoryPublic] = useState(false);
  const [userConsent, setUserConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const q = new URLSearchParams(location.search);
    const t = q.get("type");
    if (t === "org" || t === "family" || t === "personal") setKind(t);
    if (q.get("beta") === "1") setBeta(true);
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const data: Record<string, unknown> = { ...f, privacy, marketing };
    if (kind !== "org") Object.assign(data, { age, device, pains, source, beta, storyPublic });
    if (kind === "family") Object.assign(data, { relation, userConsent });
    if (kind === "org") Object.assign(data, { region, size, interests });
    let ref = "";
    let utm = "";
    try {
      ref = sessionStorage.getItem("tv-ref") || "";
      utm = sessionStorage.getItem("tv-utm") || "";
    } catch {}
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, data, ref, utm, website: f.website || "", startedAt: startedAt.current }),
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || "접수하지 못했습니다.");
      try {
        sessionStorage.setItem(
          "tv-result",
          JSON.stringify({ code: out.code, kind, beta, date: new Date().toISOString().slice(0, 10) }),
        );
      } catch {}
      router.push("/reserve/done");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[data-error]")?.focus());
    }
  };

  const contactBlock = (who: string) => (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label={`${who} 이름`} req>
          <input className="field" name="name" autoComplete="name" required value={f.name || ""} onChange={set("name")} />
        </Field>
      </div>
      <Field label="휴대폰 번호" req hint="체험단·출시 안내 연락용">
        <input
          className="field"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="010-1234-5678"
          required
          value={f.phone || ""}
          onChange={set("phone")}
        />
      </Field>
      <Field label="이메일" req hint="신청 확인 메일을 보내 드려요">
        <input
          className="field"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          required
          value={f.email || ""}
          onChange={set("email")}
        />
      </Field>
    </div>
  );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative">
      {/* 유형 탭 */}
      <div className="relative">
        <div role="tablist" aria-label="신청 유형" className="grid grid-cols-3 gap-2 rounded-[24px] bg-paper/[0.05] p-1.5">
          {TABS.map((t) => (
            <button
              key={t.k}
              type="button"
              role="tab"
              aria-selected={kind === t.k}
              onClick={() => {
                setKind(t.k);
                setError("");
              }}
              className={`rounded-[18px] px-2 py-3 text-center transition-colors duration-200 ${
                kind === t.k ? "bg-paper text-ink" : "text-paper/75 hover:bg-paper/[0.06]"
              }`}
            >
              <span className="block text-[1.125rem] font-extrabold">{t.label}</span>
              <span className={`block text-[0.8125rem] ${kind === t.k ? "text-ink/60" : "text-paper/45"}`}>{t.sub}</span>
            </button>
          ))}
        </div>
        <DogWalker size={76} />
      </div>

      <div className="mt-10 grid gap-9">
        {kind === "personal" && (
          <>
            {contactBlock("")}
            <Group label="연령대">
              <Chips name="연령대" options={AGES} value={age} onChange={(v) => setAge(v as string)} />
            </Group>
            <Group label="휴대폰 기종">
              <Chips name="휴대폰 기종" options={DEVICES} value={device} onChange={(v) => setDevice(v as string)} />
            </Group>
            <Group label="화면이 잘 안 보여 멈추는 순간 (여러 개)">
              <Chips name="불편한 상황" options={PAINS} value={pains} onChange={(v) => setPains(v as string[])} multiple />
            </Group>
          </>
        )}

        {kind === "family" && (
          <>
            <div className="rounded-[24px] border border-paper/10 bg-paper/[0.03] p-5 text-[1rem] leading-[1.6] text-paper/75">
              부모님 대신 신청하시는 분의 연락처로 안내를 드립니다. 첫 눈도장 혜택은 <b className="text-paper">본인과 가족 2명</b>까지
              함께 쓸 수 있어요.
            </div>
            {contactBlock("신청하시는 분")}
            <Group label="사용하실 분과의 관계" req>
              <Chips name="관계" options={RELATIONS} value={relation} onChange={(v) => setRelation(v as string)} />
            </Group>
            <Group label="사용하실 분의 연령대">
              <Chips name="연령대" options={AGES} value={age} onChange={(v) => setAge(v as string)} />
            </Group>
            <Group label="사용하실 분의 휴대폰 기종">
              <Chips name="기종" options={DEVICES} value={device} onChange={(v) => setDevice(v as string)} />
            </Group>
            <Group label="부모님이 화면 때문에 멈추는 순간 (여러 개)">
              <Chips name="불편한 상황" options={PAINS} value={pains} onChange={(v) => setPains(v as string[])} multiple />
            </Group>
            <label className="check">
              <input type="checkbox" checked={userConsent} onChange={(e) => setUserConsent(e.target.checked)} />
              <span>
                <b>사용하실 분의 동의를 받았습니다.</b> <span className="text-tap">*</span>
              </span>
            </label>
          </>
        )}

        {kind === "org" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="기관명" req>
                  <input className="field" name="org" autoComplete="organization" value={f.org || ""} onChange={set("org")} />
                </Field>
              </div>
              <Field label="담당자 이름" req>
                <input className="field" name="name" autoComplete="name" value={f.name || ""} onChange={set("name")} />
              </Field>
              <Field label="직함">
                <input className="field" name="title" autoComplete="organization-title" value={f.title || ""} onChange={set("title")} />
              </Field>
              <Field label="연락처" req>
                <input className="field" name="phone" type="tel" inputMode="tel" placeholder="010-1234-5678" value={f.phone || ""} onChange={set("phone")} />
              </Field>
              <Field label="이메일" req>
                <input className="field" name="email" type="email" inputMode="email" value={f.email || ""} onChange={set("email")} />
              </Field>
              <Field label="지역" req>
                <select className="field" value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">선택해 주세요</option>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="예상 이용자 수">
                <select className="field" value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="">선택해 주세요</option>
                  {SIZES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Group label="관심 있는 방식 (여러 개)">
              <Chips name="관심" options={INTERESTS} value={interests} onChange={(v) => setInterests(v as string[])} multiple />
            </Group>
            <Field label="남기실 말씀">
              <textarea className="field min-h-32 py-4" name="memo" value={f.memo || ""} onChange={set("memo")} />
            </Field>
          </>
        )}

        {kind !== "org" && (
          <>
            <Group label="알게 된 경로">
              <Chips name="알게 된 경로" options={SOURCES} value={source} onChange={(v) => setSource(v as string)} />
            </Group>

            <div className={`relative rounded-[28px] border p-6 transition-colors sm:p-7 ${beta ? "border-mint/60 bg-mint/[0.06]" : "border-paper/12 bg-paper/[0.03]"}`}>
              <label className="check">
                <input type="checkbox" checked={beta} onChange={(e) => setBeta(e.target.checked)} />
                <span>
                  <b className="text-[1.125rem]">체험단(평생 눈도장)도 신청할게요</b>
                  <span className="mt-1 block text-[0.9375rem] text-paper/60">
                    출시 전에 먼저 써 보고 의견을 주시면 평생 무료 (본인+가족 2명). 5명 → 30명 → 100명 순서로 선발해 따로 연락드려요.
                  </span>
                </span>
              </label>
              {beta && (
                <div className="mt-5 grid gap-3">
                  <Field label="내가 멈춘 순간, 한 줄로" hint="예) 약 봉투 글씨를 못 읽어 약사에게 다시 물어봤어요.">
                    <input className="field" name="story" maxLength={300} value={f.story || ""} onChange={set("story")} />
                  </Field>
                  <label className="check text-[0.9375rem]">
                    <input type="checkbox" checked={storyPublic} onChange={(e) => setStoryPublic(e.target.checked)} />
                    <span>이 한 줄을 이름 없이 탭뷰 사이트에 소개해도 좋아요.</span>
                  </label>
                </div>
              )}
              <Dog pose="cape" motion="float" className="absolute -top-16 -right-1 h-20 w-20 sm:-top-12 sm:h-24 sm:w-24" />
            </div>
          </>
        )}

        {/* 스팸 방지용 숨은 칸 */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website || ""} onChange={set("website")} />

        <div className="grid gap-3 border-t border-paper/10 pt-8">
          <label className="check">
            <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
            <span>
              <b>개인정보 수집·이용에 동의합니다.</b> <span className="text-tap">*</span>
              <span className="mt-1 block text-[0.9375rem] text-paper/60">
                이름·연락처·이메일{kind === "org" ? "·기관 정보" : "·선택 항목"}을 사전 예약 확인, 출시·혜택 안내
                {kind === "org" ? ", 기관 도입 상담" : ""}에 씁니다. 혜택 안내를 마치거나 동의를 철회하면 지체 없이 파기합니다.{" "}
                <a href="/privacy" target="_blank" className="underline underline-offset-4">
                  자세히
                </a>
              </span>
            </span>
          </label>
          <label className="check">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>
              개발 소식 메일을 받아 볼게요. <span className="text-[0.875rem] text-paper/45">선택</span>
            </span>
          </label>
        </div>

        {error && (
          <div data-error tabIndex={-1} role="alert" className="flex items-center gap-4 rounded-[22px] border border-tap/40 bg-tap/10 p-4 text-[1.0625rem] text-paper outline-none">
            <img src="/dog/dog-dazed.webp" alt="" aria-hidden width={512} height={512} className="h-16 w-16 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="group inline-flex h-16 items-center justify-center gap-3 rounded-full bg-paper text-[1.25rem] font-extrabold text-forest transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? "접수하는 중…" : kind === "org" ? "기관 신청하기" : "첫 눈도장 찍기"}
        </button>
      </div>
    </form>
  );
}
