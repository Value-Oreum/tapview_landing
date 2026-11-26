/**
 * 히어로 폰 속 문자 화면 (안드로이드 메시지 앱 다크 모드 느낌).
 * 크기는 모두 화면 너비 기준(cqw)이라 어떤 창 크기에서도 사진 속 화면에 꼭 맞는다.
 * 병원 이름·번호는 가상이다.
 */
export default function SmsScreen() {
  return (
    <div className="absolute inset-0 bg-[#121513] text-[#e9ece8]" style={{ fontSize: "5.4cqw" }}>
      {/* 상태 표시줄 */}
      <div className="absolute inset-x-0 top-[1.1%] flex items-center justify-between px-[7cqw] text-[3.9cqw] font-semibold text-[#e9ece8]/85">
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

      {/* 앱 상단 */}
      <div className="absolute inset-x-0 top-[4.6%] flex items-center gap-[3.4cqw] px-[5cqw]">
        <svg viewBox="0 0 24 24" className="h-[6cqw] w-[6cqw]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="grid h-[9.5cqw] w-[9.5cqw] place-items-center rounded-full bg-[#2e5b43] text-[4.6cqw] font-bold text-[#d8f5e6]">
          새
        </span>
        <span className="text-[5.6cqw] font-semibold">새봄내과의원</span>
      </div>

      <div className="absolute inset-x-0 top-[12.6%] text-center text-[3.6cqw] text-[#e9ece8]/55">
        11월 26일 목요일
      </div>

      {/* 이전 문자 */}
      <div className="absolute left-[5cqw] top-[16%] w-[78cqw] rounded-[5cqw] rounded-tl-[1.6cqw] bg-[#252a27] px-[4.6cqw] py-[3.4cqw] leading-[1.45]">
        [새봄내과의원] 지난 검진 결과가 등록되었습니다. 앱에서 확인해 주세요.
      </div>

      {/* 핵심 문자: 일시 줄이 알약 창 높이에 오도록 배치 */}
      <div className="absolute left-[5cqw] top-[31%] w-[82cqw] rounded-[5cqw] rounded-tl-[1.6cqw] bg-[#252a27] px-[4.6cqw] py-[3.8cqw] leading-[1.5]">
        <p>[새봄내과의원] 진료 예약 안내</p>
        <p className="mt-[2.6cqw] text-[6.6cqw] leading-[1.32] font-bold text-white">
          12월 3일(수)
          <br />
          오전 10:30
        </p>
        <p className="mt-[2.6cqw]">장소: 본관 2층 내과</p>
        <p>준비: 신분증, 복용 중인 약</p>
        <p className="mt-[2cqw] text-[#e9ece8]/70">변경 문의 02-000-0000</p>
      </div>
      <div className="absolute left-[6cqw] top-[61.5%] text-[3.4cqw] text-[#e9ece8]/50">오전 8:10</div>

      {/* 입력창 */}
      <div className="absolute inset-x-[4cqw] bottom-[3%] flex h-[11cqw] items-center rounded-full bg-[#202522] px-[5cqw] text-[4.4cqw] text-[#e9ece8]/45">
        문자 메시지
      </div>
    </div>
  );
}
