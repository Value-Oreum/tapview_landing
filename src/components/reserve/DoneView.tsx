"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DogClip } from "@/components/DogMotion";
import gsap from "gsap";
import Dog from "@/components/Dog";
import { prefersReducedMotion } from "@/components/providers/PrefsProvider";

type Result = { code: string; kind: "personal" | "family" | "org"; beta: boolean; date: string };
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** 카드 이미지를 캔버스로 그려 PNG로 만든다 (1080×1350, 인스타그램 세로 비율) */
async function drawCard(code: string, date: string): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return null;
  const family = getComputedStyle(document.body).fontFamily;
  await document.fonts.ready;
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#0d3f22");
  grad.addColorStop(1, "#060807");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  // 도장
  g.save();
  g.translate(W / 2, 470);
  g.rotate((-12 * Math.PI) / 180);
  g.strokeStyle = "#ffd45a";
  g.lineWidth = 14;
  g.beginPath();
  g.arc(0, 0, 230, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 4;
  g.beginPath();
  g.arc(0, 0, 196, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#ffd45a";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 82px ${family}`;
  g.fillText("첫 눈도장", 0, 0);
  g.font = `600 40px ${family}`;
  g.fillText("TapView", 0, -128);
  g.fillText(date.replaceAll("-", "."), 0, 128);
  g.restore();
  // 글
  g.textAlign = "center";
  g.fillStyle = "#f2f4ef";
  g.font = `800 96px ${family}`;
  g.fillText(code, W / 2, 860);
  g.font = `600 48px ${family}`;
  g.fillText("출시 후 첫 1년 무료 · 본인+가족 2명", W / 2, 970);
  g.fillStyle = "#8bf2c2";
  g.font = `600 44px ${family}`;
  g.fillText("#첫눈에탭  #탭뷰어", W / 2, 1060);
  g.fillStyle = "rgba(242,244,239,.6)";
  g.font = `400 40px ${family}`;
  g.fillText("선명하게 보이면, 탭.  tapview.app", W / 2, 1230);
  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

export default function DoneView() {
  const [r, setR] = useState<Result | null>(null);
  const [copied, setCopied] = useState("");
  const stampRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tv-result");
      if (raw) setR(JSON.parse(raw));
      else setR({ code: "", kind: "personal", beta: false, date: new Date().toISOString().slice(0, 10) });
    } catch {
      setR({ code: "", kind: "personal", beta: false, date: new Date().toISOString().slice(0, 10) });
    }
  }, []);

  // 도장 '쾅'
  useIsoLayoutEffect(() => {
    if (!r || !stampRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.3 })
        .fromTo(stampRef.current, { scale: 2.4, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: 0.35, ease: "power4.in" })
        .fromTo(cardRef.current, { y: 0 }, { y: 6, duration: 0.06, yoyo: true, repeat: 3, ease: "none" })
        .fromTo("[data-dust]", { scale: 0.6, opacity: 0.8 }, { scale: 1.6, opacity: 0, duration: 0.6, ease: "power2.out" }, "<");
    });
    return () => ctx.revert();
  }, [r]);

  if (!r) return <div className="min-h-[60vh]" />;

  const isOrg = r.kind === "org";
  const origin = typeof location !== "undefined" ? location.origin : "https://tapview.app";
  const invite = r.code ? `${origin}/?ref=${r.code}` : origin;
  const parentText = `휴대폰 글씨 잘 안 보이시죠? '탭뷰'를 사전 예약해 두었어요. 출시되면 1년 무료래요. 같이 써 봐요! #첫눈에탭`;
  const friendText = `나 탭뷰 첫 눈도장 찍었어! 사전 예약하면 출시 후 1년 무료래. 너도 찍어 봐 #첫눈에탭 #탭뷰어`;

  const share = async (text: string, label: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "탭뷰 TapView", text, url: invite });
        return;
      }
    } catch {
      return;
    }
    await navigator.clipboard?.writeText(`${text}\n${invite}`);
    setCopied(label);
    setTimeout(() => setCopied(""), 2200);
  };
  const copyLink = async () => {
    await navigator.clipboard?.writeText(invite);
    setCopied("link");
    setTimeout(() => setCopied(""), 2200);
  };
  const saveImage = async () => {
    const blob = await drawCard(r.code || "TV-0000", r.date);
    if (!blob) return;
    const file = new File([blob], `첫 눈도장_${r.code}.png`, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: friendText });
        return;
      } catch {
        return;
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  if (isOrg) {
    return (
      <div className="mx-auto max-w-[760px] text-center">
        <Dog pose="thumb" motion="bounce" className="mx-auto h-40 w-40" />
        <h1 className="mt-6 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.12] font-semibold tracking-[-0.04em] text-paper">
          기관 신청이 접수되었습니다.
        </h1>
        <p className="mt-5 text-[1.1875rem] leading-[1.7] text-paper/72">
          보내 주신 이메일로 확인 메일을 드렸습니다. 내용을 살펴보고 담당자가 연락드리겠습니다.
        </p>
        <a href="/" className="mt-10 inline-flex h-14 items-center rounded-full border border-paper/25 px-8 text-[1.0625rem] font-semibold text-paper">
          처음으로
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1100px] items-center gap-14 lg:grid-cols-2">
      <div className="relative">
        <div
          ref={cardRef}
          className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[36px] border border-paper/10 bg-gradient-to-b from-[#0d3f22] to-ink p-8 text-center"
        >
          <span data-dust aria-hidden className="absolute top-[34%] left-1/2 -mt-28 -ml-28 h-56 w-56 rounded-full border-2 border-tap/40 opacity-0" />
          <div
            ref={stampRef}
            className="relative mx-auto mt-6 grid h-52 w-52 -rotate-12 place-items-center rounded-full border-[7px] border-tap text-tap"
          >
            <span aria-hidden className="absolute inset-3 rounded-full border-2 border-tap" />
            <span className="absolute top-8 text-[0.9375rem] font-semibold">TapView</span>
            <span className="text-[1.875rem] font-extrabold tracking-[-0.03em] whitespace-nowrap">첫 눈도장</span>
            <span className="absolute bottom-8 text-[0.875rem] font-semibold">{r.date.replaceAll("-", ".")}</span>
          </div>
          <p className="mt-8 text-[2.5rem] font-extrabold tracking-[0.02em] text-paper">{r.code || "TV-····"}</p>
          <p className="mt-2 text-[1.0625rem] font-semibold text-paper/85">출시 후 첫 1년 무료 · 본인+가족 2명</p>
          <p className="mt-2 text-[1rem] font-semibold text-mint">#첫눈에탭 #탭뷰어</p>
        </div>
        <DogClip clip="cheer" className="absolute -bottom-8 -left-2 h-36 w-36 sm:-left-10 sm:h-40 sm:w-40" delay={0.6} />
        <DogClip clip="headspin" className="absolute -top-14 -right-4 h-36 w-36 sm:-right-12" delay={0.8} />
      </div>

      <div>
        <h1 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.12] font-semibold tracking-[-0.04em] text-paper">
          첫 눈도장, 쾅!
          <br />
          <span className="text-mint">탭뷰어가 되셨어요.</span>
        </h1>
        <p className="mt-5 text-[1.125rem] leading-[1.7] text-paper/72">
          신청 확인 메일을 보내 드렸어요. 출시 소식과 1년 무료 혜택은 이메일과 문자로 가장 먼저 알려 드릴게요.
          {r.beta && " 체험단(평생 눈도장) 신청도 함께 접수되었습니다."}
        </p>

        <div className="mt-8 rounded-[24px] border border-mint/30 bg-mint/[0.06] p-5 text-[1.0625rem] leading-[1.6] text-paper/85">
          <b className="text-paper">내 링크로 3명이 첫 눈도장을 찍으면</b>, 평생 눈도장 체험단에 우선 선발됩니다.
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => share(parentText, "parent")} className="share-btn share-btn--primary">
            부모님께 보내기
          </button>
          <button type="button" onClick={() => share(friendText, "friend")} className="share-btn">
            친구에게 공유
          </button>
          <button type="button" onClick={saveImage} className="share-btn">
            카드 이미지 저장
          </button>
          <button type="button" onClick={copyLink} className="share-btn">
            내 링크 복사
          </button>
        </div>
        <p aria-live="polite" className="mt-4 min-h-6 text-[0.9375rem] text-mint">
          {copied === "link" && "링크를 복사했어요. 카카오톡에 붙여 넣어 보내 보세요."}
          {(copied === "parent" || copied === "friend") && "메시지와 링크를 복사했어요. 카카오톡에 붙여 넣어 보내 보세요."}
        </p>
        <p className="mt-2 text-[0.875rem] break-all text-paper/45">{invite}</p>
      </div>
    </div>
  );
}
