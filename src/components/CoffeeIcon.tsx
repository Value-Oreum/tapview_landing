/** 아이스 아메리카노 그림 (친구 초대 이벤트). 브랜드 로고·사진은 쓰지 않는다 */
export default function CoffeeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 84" className={className} aria-hidden="true">
      <path d="M40 2l-5 13" stroke="#8bf2c2" strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M10 16h44l-5.2 61.6a4 4 0 0 1-4 3.6H19.2a4 4 0 0 1-4-3.6z"
        fill="rgba(242,244,239,.1)"
        stroke="rgba(242,244,239,.55)"
        strokeWidth="2"
      />
      <path d="M13.6 30h36.8l-4 46.6a3 3 0 0 1-3 2.7H20.6a3 3 0 0 1-3-2.7z" fill="#3a2214" />
      <rect x="19" y="33" width="11" height="11" rx="2.4" fill="rgba(255,255,255,.5)" transform="rotate(-12 24.5 38.5)" />
      <rect x="33" y="36" width="10.5" height="10.5" rx="2.4" fill="rgba(255,255,255,.4)" transform="rotate(11 38 41)" />
      <rect x="25" y="47" width="9.5" height="9.5" rx="2.2" fill="rgba(255,255,255,.3)" transform="rotate(4 29.7 51.7)" />
      <rect x="7" y="10.5" width="50" height="7.5" rx="3.75" fill="#f2f4ef" />
    </svg>
  );
}
