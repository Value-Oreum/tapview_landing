/**
 * 히어로 폰 속 '앱 스플래시' 화면. 딥그린 바탕 위에서 강아지가 자다가 깨어 손을 흔든다.
 * 포즈마다 몸통(body)과 효과 표시(fx: Zzz·점·별·선)를 나눠 두어 따로 움직인다.
 * 위치·크기는 화면 너비 기준(cqw), 세로 위치는 Hero가 알약 창 높이에 맞춰 --dog-y로 넘겨준다.
 */
const POSES = [
  { key: "sleep", alt: "" },
  { key: "dazed", alt: "" },
  { key: "jump", alt: "" },
  { key: "wave", alt: "" },
] as const;

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="absolute inset-x-0 top-[1.1%] flex items-center justify-between px-[7cqw] text-[3.9cqw] font-semibold text-paper/70">
        <span>8:10</span>
        <span className="flex items-center gap-[1.6cqw]" aria-hidden>
          <svg viewBox="0 0 16 12" className="h-[3.2cqw] w-auto" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx=".6" />
            <rect x="4.3" y="5.5" width="3" height="6.5" rx=".6" />
            <rect x="8.6" y="3" width="3" height="9" rx=".6" />
            <rect x="12.9" y="0" width="3" height="12" rx=".6" opacity=".4" />
          </svg>
          <svg viewBox="0 0 24 12" className="h-[3.2cqw] w-auto" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1" y="1" width="19" height="10" rx="2.5" />
            <rect x="3" y="3" width="12" height="6" rx="1" fill="currentColor" stroke="none" />
            <path d="M22 4.5v3" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div className="splash-dog" data-dog>
        <span className="dog-shadow" data-dog-shadow />
        {POSES.map((p) => (
          <div key={p.key} className="dog-pose" data-pose={p.key}>
            <img src={`/dog/dog-${p.key}-body.webp`} alt={p.alt} width={512} height={512} draggable={false} data-body />
            <img src={`/dog/dog-${p.key}-fx.webp`} alt="" width={512} height={512} draggable={false} data-fx className="dog-fx" />
          </div>
        ))}
      </div>
    </div>
  );
}
