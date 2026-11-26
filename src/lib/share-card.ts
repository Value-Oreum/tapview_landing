/**
 * 공유 카드 이미지 (캔버스 → PNG). 강아지 캐릭터·눈도장·내 번호·QR(내 링크)을 한 장에.
 *   story  1080×1350 (인스타그램·사진·문자)
 *   square 1080×1080 (카카오톡 공유 카드)
 */
export type CardSize = "story" | "square";

const W = 1080;
const INK = "#060807";
const PAPER = "#f2f4ef";
const MINT = "#8bf2c2";
const TAP = "#ffd45a";
const FOREST = "#013f15";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function stamp(g: CanvasRenderingContext2D, cx: number, cy: number, r: number, date: string, font: string) {
  g.save();
  g.translate(cx, cy);
  g.rotate((-12 * Math.PI) / 180);
  g.strokeStyle = TAP;
  g.lineWidth = r * 0.07;
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = r * 0.02;
  g.beginPath();
  g.arc(0, 0, r * 0.84, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = TAP;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${Math.round(r * 0.36)}px ${font}`;
  g.fillText("첫 눈도장", 0, 0);
  g.font = `600 ${Math.round(r * 0.17)}px ${font}`;
  g.fillText("TapView", 0, -r * 0.55);
  g.fillText(date.replaceAll("-", "."), 0, r * 0.56);
  g.restore();
}

export async function drawCard({
  code,
  date,
  invite,
  size,
}: {
  code: string;
  date: string;
  invite: string;
  size: CardSize;
}): Promise<Blob | null> {
  const H = size === "story" ? 1350 : 1080;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return null;

  const font = getComputedStyle(document.body).fontFamily;
  await Promise.all(["800 80px", "600 40px", "400 40px"].map((w) => document.fonts.load(`${w} ${font}`).catch(() => [])));
  const [dog, logo] = await Promise.all([loadImage("/dog/dog-wave.webp"), loadImage("/brand/logo-white.webp")]);

  // 바탕
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0f4a28");
  bg.addColorStop(0.55, "#0a2416");
  bg.addColorStop(1, INK);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.72, H * 0.3, 10, W * 0.72, H * 0.3, W * 0.6);
  glow.addColorStop(0, "rgba(139,242,194,0.18)");
  glow.addColorStop(1, "rgba(139,242,194,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  // 로고
  const lw = 230;
  g.drawImage(logo, 80, 78, lw, (lw * logo.height) / logo.width);

  g.textAlign = "left";
  g.textBaseline = "alphabetic";
  g.fillStyle = PAPER;
  if (size === "story") {
    g.font = `800 84px ${font}`;
    g.fillText("같이 첫 눈도장", 80, 275);
    g.fillStyle = MINT;
    g.fillText("찍어요!", 80, 375);

    stamp(g, 300, 640, 190, date, font);
    g.drawImage(dog, 520, 420, 500, 500);

    g.fillStyle = PAPER;
    g.textAlign = "center";
    g.font = `800 92px ${font}`;
    g.fillText(code, W / 2 - 70, 1000);
    g.font = `600 40px ${font}`;
    g.fillStyle = "rgba(242,244,239,0.88)";
    g.fillText("사전 예약하면 출시 후 1년 무료", W / 2 - 70, 1072);
    g.fillStyle = MINT;
    g.font = `600 34px ${font}`;
    g.fillText("본인 + 가족 2명까지 · #첫눈에탭", W / 2 - 70, 1126);
  } else {
    g.font = `800 76px ${font}`;
    g.fillText("같이 첫 눈도장", 80, 255);
    g.fillStyle = MINT;
    g.fillText("찍어요!", 80, 345);
    stamp(g, 270, 600, 165, date, font);
    g.drawImage(dog, 500, 330, 520, 520);
    g.fillStyle = PAPER;
    g.font = `600 40px ${font}`;
    g.fillText("사전 예약하면 출시 후 1년 무료", 80, 900);
    g.fillStyle = "rgba(242,244,239,0.7)";
    g.font = `600 34px ${font}`;
    g.fillText(`${code} · 본인 + 가족 2명까지`, 80, 958);
  }

  // QR (내 링크) — 스토리 카드 오른쪽 아래
  if (size === "story") {
    const QR = await import("qrcode");
    const q = document.createElement("canvas");
    await QR.toCanvas(q, invite, { margin: 1, width: 200, color: { dark: FOREST, light: "#ffffff" } });
    roundRect(g, W - 80 - 236, H - 80 - 280, 236, 280, 28);
    g.fillStyle = "#ffffff";
    g.fill();
    g.drawImage(q, W - 80 - 218, H - 80 - 262, 200, 200);
    g.fillStyle = FOREST;
    g.textAlign = "center";
    g.font = `600 26px ${font}`;
    g.fillText("찍으면 바로 예약", W - 80 - 118, H - 80 - 22);
  }

  // 아래 주소
  g.textAlign = "left";
  g.fillStyle = "rgba(242,244,239,0.6)";
  g.font = `400 34px ${font}`;
  g.fillText("tapview.app · 선명하게 보이면, 탭.", 80, H - 92);

  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}
