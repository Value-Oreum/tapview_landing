import { clean, stampCode, TYPES, type SubmitType } from "@/lib/reserve";

/**
 * 사전예약·문의 접수. 검사 → 스팸 차단 → 눈도장 코드 발급 → Apps Script로 전달(시트 저장 + 메일).
 * 환경 변수: APPS_SCRIPT_URL, APPS_SCRIPT_SECRET (Vercel에만 저장, 브라우저에 노출하지 않음)
 */
const MSG = {
  ko: {
    bad: "요청 형식이 올바르지 않습니다.",
    type: "신청 유형을 확인해 주세요.",
    wait: "접수 준비 중입니다. 잠시 후 다시 시도해 주세요.",
    fail: "접수 중 문제가 생겼습니다. 잠시 후 다시 시도하시거나 tapview@tapview.app으로 알려 주세요.",
  },
  ja: {
    bad: "リクエストの形式が正しくありません。",
    type: "お申し込みの種類をご確認ください。",
    wait: "受付の準備中です。しばらくしてからもう一度お試しください。",
    fail: "受付中に問題が発生しました。しばらくしてからもう一度お試しいただくか、tapview@tapview.app までご連絡ください。",
  },
} as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: MSG.ko.bad }, { status: 400 });
  }

  const type = body.type as SubmitType;
  const m = MSG[type === "japan" || body.lang === "ja" ? "ja" : "ko"];
  if (!TYPES.includes(type)) return Response.json({ ok: false, error: m.type }, { status: 400 });

  // 스팸 차단: 숨은 칸이 채워졌거나, 화면을 연 지 2.5초 안에 제출하면 조용히 성공처럼 응답
  const startedAt = Number(body.startedAt) || 0;
  if (body.website || (startedAt && Date.now() - startedAt < 2500)) {
    return Response.json({ ok: true, code: stampCode() });
  }

  const result = clean(type, (body.data as Record<string, unknown>) ?? {});
  if (!result.ok) return Response.json({ ok: false, error: result.error }, { status: 422 });

  const code = type === "personal" || type === "family" ? stampCode() : "";
  const ref = typeof body.ref === "string" && /^TV-[A-Z0-9]{4}$/.test(body.ref) ? body.ref : "";
  const utm = typeof body.utm === "string" ? body.utm.slice(0, 200) : "";

  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[submit:dev] Apps Script 미설정 — 저장하지 않음", { type, code, ref, data: result.data });
      return Response.json({ ok: true, code, dev: true });
    }
    return Response.json({ ok: false, error: m.wait }, { status: 503 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        type,
        code,
        ref,
        utm,
        ua: request.headers.get("user-agent")?.slice(0, 200) ?? "",
        data: result.data,
      }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; code?: string; dup?: boolean } | null;
    if (!out?.ok) throw new Error(out?.error || `apps script ${res.status}`);
    // 같은 휴대폰으로 이미 신청했으면 Apps Script가 기존 코드를 돌려준다 (내 링크가 바뀌지 않게)
    const finalCode = typeof out.code === "string" && /^TV-[A-Z0-9]{4}$/.test(out.code) ? out.code : code;
    return Response.json({ ok: true, code: finalCode, dup: out.dup === true });
  } catch (e) {
    console.error("[submit] 전달 실패", e);
    return Response.json({ ok: false, error: m.fail }, { status: 502 });
  }
}
