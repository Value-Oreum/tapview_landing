/**
 * 내 링크 진행도: 완료 화면이 '지금까지 n명'을 보여 줄 때 묻는다.
 * Apps Script에 서버에서만 비밀 키로 물어보고, 숫자만 돌려준다.
 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  if (!/^TV-[A-Z0-9]{4}$/.test(code)) return Response.json({ ok: false }, { status: 400 });
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) return Response.json({ ok: false }, { status: 503 });
  try {
    const res = await fetch(`${url}?check=${encodeURIComponent(secret)}&invite=${code}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const out = (await res.json()) as { ok?: boolean; count?: number; goal?: number };
    if (!out.ok || typeof out.count !== "number") return Response.json({ ok: false }, { status: 502 });
    return Response.json({ ok: true, count: out.count, goal: out.goal ?? 3 }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
