/**
 * 히어로 폰 속 '앱 스플래시' 화면: 딥그린 바탕 + 탭뷰 로고.
 * 강아지는 폰보다 크게 보이도록 Hero의 별도 층(HeroDog)에서 그린다.
 */
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
      <img
        src="/brand/logo-white.png"
        alt=""
        width={640}
        height={222}
        className="absolute top-[9%] left-1/2 w-[46cqw] -translate-x-1/2 opacity-95"
        draggable={false}
      />
      <p className="absolute inset-x-0 bottom-[7%] text-center text-[4.2cqw] font-semibold tracking-[-0.01em] text-paper/70">
        선명하게 보이면, 탭.
      </p>
    </div>
  );
}
