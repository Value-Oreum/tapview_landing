"use client";

import { useEffect, useRef, useState } from "react";
import { drawCard } from "@/lib/share-card";
import { loadKakao, type KakaoSDK } from "@/lib/kakao";
import { COFFEE_GOAL } from "@/lib/event";

type Tone = "parent" | "friend";
type Channel = "kakao" | "instagram" | "message" | "copy";

const TEXT: Record<Tone, { title: string; body: string }> = {
  parent: {
    title: "휴대폰 글씨, 이제 내 눈에 맞게",
    body: "휴대폰 글씨 잘 안 보이시죠? '탭뷰'는 두 화면 중 편한 쪽을 탭하면 내 눈에 맞는 화면으로 바꿔 주는 앱이에요. 사전 예약하면 출시 후 1년 무료래요. 아래 링크로 같이 신청해요!",
  },
  friend: {
    title: "탭뷰 첫 눈도장, 같이 찍어요!",
    body: "나 탭뷰 첫 눈도장 찍었어! 작은 글씨 화면을 내 눈에 맞춰 주는 앱인데, 사전 예약하면 출시 후 1년 무료래. 내 링크로 같이 찍어 줘 #첫눈에탭",
  },
};

/** 경로마다 꼬리표를 붙여, 어디서 들어왔는지 시트 '유입' 칸과 통계에서 볼 수 있게 */
const linkFor = (origin: string, code: string, ch: Channel) =>
  `${origin}/?ref=${code}&utm_source=${ch}&utm_medium=invite&utm_campaign=first_stamp`;

/**
 * '공유하기' 창. 열리는 순간 카드 이미지를 미리 만들어(카카오는 이미지도 미리 올려) 두고,
 * 버튼을 누르면 바로 공유창을 띄운다(사파리는 누른 직후에만 공유창을 허용).
 * 공유창은 사이트 위에 잠깐 뜨는 것이라 페이지를 떠나지 않고, 끝나면 이 창에서 '보냈어요'를 보여 준다.
 */
export default function ShareSheet({
  open,
  onClose,
  code,
  date,
  invites,
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  date: string;
  invites: number | null;
}) {
  const [tone, setTone] = useState<Tone>("friend");
  const [story, setStory] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [kakao, setKakao] = useState<KakaoSDK | null>(null);
  const [kakaoImg, setKakaoImg] = useState<{ url: string; w: number; h: number } | null>(null);
  const [done, setDone] = useState<Channel | null>(null);
  const [note, setNote] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const origin = typeof location !== "undefined" ? location.origin : "https://tapview.app";

  // 열릴 때: 카드 만들기 + 카카오 준비(이미지 미리 올리기)
  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      const blob = await drawCard({ code, date, invite: linkFor(origin, code, "instagram"), size: "story" });
      if (!alive || !blob) return;
      setStory(new File([blob], `탭뷰_첫눈도장_${code}.png`, { type: "image/png" }));
      setPreview(URL.createObjectURL(blob));
      const K = await loadKakao();
      if (!alive || !K) return;
      setKakao(K);
      const sq = await drawCard({ code, date, invite: linkFor(origin, code, "kakao"), size: "square" });
      if (!alive || !sq) return;
      try {
        const up = await K.Share.uploadImage({ file: [new File([sq], `tapview_${code}.png`, { type: "image/png" })] });
        if (alive) setKakaoImg({ url: up.infos.original.url, w: 1080, h: 1080 });
      } catch {
        /* 올리기 실패 → 기본 공유 이미지로 보낸다 */
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, code, date, origin]);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  // Esc로 닫기, 열리면 첫 버튼에 초점
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("[data-first]")?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  const t = TEXT[tone];
  /** 닫을 때 '보냈어요' 상태를 지워, 다시 열면 처음 화면부터 */
  const close = () => {
    setDone(null);
    setNote("");
    onClose();
  };

  const finish = (ch: Channel, msg = "") => {
    setDone(ch);
    setNote(msg);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      finish("copy", msg);
    } catch {
      setNote("복사하지 못했어요. 아래 링크를 길게 눌러 복사해 주세요.");
    }
  };

  const shareKakao = async () => {
    const url = linkFor(origin, code, "kakao");
    if (kakao) {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: t.title,
          description: `사전 예약하면 출시 후 1년 무료 · 본인+가족 2명`,
          imageUrl: kakaoImg?.url ?? `${origin}/og-ko.jpg`,
          imageWidth: kakaoImg?.w ?? 1200,
          imageHeight: kakaoImg?.h ?? 630,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [{ title: "첫 눈도장 찍기", link: { mobileWebUrl: url, webUrl: url } }],
      });
      finish("kakao");
      return;
    }
    // 카카오 키가 없으면: 휴대폰 공유창(카카오톡 고르기) → 안 되면 복사
    if (navigator.share) {
      try {
        await navigator.share({ title: t.title, text: t.body, url });
        finish("kakao");
      } catch {
        /* 취소 */
      }
      return;
    }
    await copy(`${t.body}\n${url}`, "메시지와 링크를 복사했어요. 카카오톡 대화방에 붙여 넣어 보내세요.");
  };

  const shareImage = async () => {
    const url = linkFor(origin, code, "instagram");
    if (story && navigator.canShare?.({ files: [story] })) {
      try {
        await navigator.share({ files: [story], text: `${t.body}\n${url}` });
        finish("instagram", "인스타그램 스토리라면 '링크' 스티커에 내 링크를 붙이면 바로 들어올 수 있어요. 카드의 QR로도 들어와요.");
      } catch {
        /* 취소 */
      }
      return;
    }
    if (!story) return;
    // PC: 이미지 내려받기
    const a = document.createElement("a");
    a.href = URL.createObjectURL(story);
    a.download = story.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    finish("instagram", "카드 이미지를 저장했어요. 인스타그램·카카오톡에 올려 보세요. 카드의 QR로 내 링크에 들어와요.");
  };

  const shareMessage = async () => {
    const url = linkFor(origin, code, "message");
    if (navigator.share) {
      try {
        await navigator.share({ title: t.title, text: t.body, url });
        finish("message");
      } catch {
        /* 취소 */
      }
      return;
    }
    await copy(`${t.body}\n${url}`, "메시지와 링크를 복사했어요. 문자나 메신저에 붙여 넣어 보내세요.");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="presentation">
      <button type="button" aria-label="닫기" onClick={close} className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="relative max-h-[92svh] w-full max-w-[540px] overflow-y-auto rounded-t-[32px] border border-paper/12 bg-[#0d1411] p-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:rounded-[32px] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 id="share-title" className="text-[1.375rem] font-semibold tracking-[-0.02em] text-paper">
            {done ? "보냈어요!" : "내 링크 공유하기"}
          </h2>
          <button type="button" onClick={close} aria-label="닫기" className="grid h-10 w-10 place-items-center rounded-full text-paper/70 hover:bg-paper/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="mt-6 text-center" role="status">
            <p className="text-[1.125rem] leading-[1.6] text-paper/85">
              친구가 내 링크로 첫 눈도장을 찍으면 초대 수에 반영돼요.
              <br />
              <b className="text-tap">{COFFEE_GOAL}명이 되면 아메리카노 1잔!</b>
            </p>
            {invites !== null && (
              <p className="mt-2 text-[1rem] font-semibold text-paper/70">
                지금까지 {invites}명 / {COFFEE_GOAL}명
              </p>
            )}
            {note && <p className="mt-4 rounded-[18px] bg-paper/[0.05] p-4 text-[0.9375rem] leading-[1.6] text-paper/75">{note}</p>}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDone(null)} className="share-btn">
                한 명 더 보내기
              </button>
              <button type="button" onClick={close} className="share-btn share-btn--primary">
                닫기
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 flex gap-4">
              <div className="aspect-[4/5] w-[34%] shrink-0 overflow-hidden rounded-[18px] border border-paper/10 bg-paper/[0.04]">
                {preview ? (
                  <img src={preview} alt="공유할 카드 미리 보기" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-[0.8125rem] text-paper/40">카드 만드는 중…</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[0.875rem] font-semibold text-paper/60">누구에게 보낼까요?</p>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="받는 사람">
                  {(["friend", "parent"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={tone === k}
                      onClick={() => setTone(k)}
                      className={`chip ${tone === k ? "chip--on" : ""}`}
                    >
                      {k === "friend" ? "친구에게" : "부모님께"}
                    </button>
                  ))}
                </div>
                <p className="mt-3 line-clamp-4 text-[0.875rem] leading-[1.55] text-paper/60">{t.body}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-2.5">
              <button
                type="button"
                data-first
                onClick={shareKakao}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[1.0625rem] font-extrabold text-[#191919]"
              >
                카카오톡으로 보내기
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={shareImage} disabled={!story} className="share-btn disabled:opacity-50">
                  인스타·사진으로
                </button>
                <button type="button" onClick={shareMessage} className="share-btn">
                  문자·다른 앱
                </button>
              </div>
              <button
                type="button"
                onClick={() => copy(linkFor(origin, code, "copy"), "내 링크를 복사했어요. 원하는 곳에 붙여 넣으세요.")}
                className="h-12 text-[0.9375rem] font-semibold text-paper/70 underline-offset-4 hover:text-paper hover:underline"
              >
                링크만 복사
              </button>
            </div>
            {note && (
              <p role="status" className="mt-2 text-center text-[0.9375rem] text-tap">
                {note}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
