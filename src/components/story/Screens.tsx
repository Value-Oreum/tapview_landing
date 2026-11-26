/**
 * 브랜드 스토리의 폰 화면 3장면. '읽기 어려운 순간'을 보여 주는 장면이라 일부러 흐리게 보인다.
 * 병원·사람 이름, 계좌·전화번호는 모두 가상이다. 크기는 화면 너비 기준(cqw).
 */

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex items-center justify-between px-[7cqw] pt-[3cqw] text-[3.9cqw] font-semibold opacity-80">
      <span>{time}</span>
      <span className="h-[2.6cqw] w-[6cqw] rounded-[0.8cqw] border border-current" />
    </div>
  );
}

export function SmsScreen() {
  return (
    <div className="absolute inset-0 bg-[#121513] text-[#e9ece8]">
      <StatusBar time="8:10" />
      <div className="mt-[4cqw] flex items-center gap-[3cqw] px-[5cqw]">
        <span className="grid h-[10cqw] w-[10cqw] place-items-center rounded-full bg-[#2e5b43] text-[4.6cqw] font-bold">새</span>
        <span className="text-[5.8cqw] font-semibold">새봄내과의원</span>
      </div>
      <div className="screen-squint mx-[5cqw] mt-[14cqw] rounded-[5cqw] rounded-tl-[1.6cqw] bg-[#252a27] px-[5cqw] py-[4.6cqw] text-[5.4cqw] leading-[1.5]">
        <p>[새봄내과의원] 진료 예약 안내</p>
        <p className="mt-[2.6cqw] text-[6.4cqw] leading-[1.3] font-bold">
          12월 3일(수)
          <br />
          오전 10:30
        </p>
        <p className="mt-[2.6cqw]">장소: 본관 2층 내과</p>
        <p>준비: 신분증, 복용 중인 약</p>
      </div>
      <p className="mt-[2cqw] px-[6cqw] text-[3.4cqw] opacity-50">오전 8:10</p>
    </div>
  );
}

export function BankScreen() {
  return (
    <div className="absolute inset-0 bg-[#f3f5f2] text-[#151916]">
      <StatusBar time="12:40" />
      <p className="mt-[6cqw] px-[6cqw] text-[5.6cqw] font-bold">송금하기</p>
      <div className="screen-squint px-[6cqw]">
        <p className="mt-[10cqw] text-[4.4cqw] opacity-60">받는 분</p>
        <p className="mt-[1cqw] text-[6cqw] font-semibold">김하늘 · 새봄은행</p>
        <p className="text-[4.2cqw] opacity-60">110-482-093617</p>
        <p className="mt-[10cqw] text-[4.4cqw] opacity-60">보낼 금액</p>
        <p className="mt-[1cqw] text-[11cqw] leading-none font-extrabold tracking-[-0.03em]">500,000원</p>
        <p className="mt-[3cqw] text-[4cqw] opacity-60">출금 가능 1,284,300원</p>
      </div>
      <div className="absolute inset-x-[6cqw] bottom-[8cqw] grid h-[13cqw] place-items-center rounded-[4cqw] bg-[#1d5a37] text-[5.2cqw] font-bold text-white">
        보내기
      </div>
    </div>
  );
}

export function PillScreen() {
  return (
    <div className="absolute inset-0 bg-[#ece6da] text-[#2a2620]">
      <StatusBar time="21:30" />
      <div className="screen-squint mx-[6cqw] mt-[8cqw] rounded-[3cqw] border-[0.6cqw] border-[#2a2620]/70 p-[4.5cqw]">
        <p className="text-[5.6cqw] font-extrabold">영양·기능 정보</p>
        <p className="mt-[3cqw] border-b-[0.5cqw] border-[#2a2620]/60 pb-[2cqw] text-[3.4cqw] leading-[1.45]">
          1일 섭취량 2정(1,000mg) 당 함량
        </p>
        {[
          ["비타민 D", "25μg (250%)"],
          ["마그네슘", "110mg (35%)"],
          ["아연", "8.5mg (100%)"],
          ["비타민 B6", "1.5mg (100%)"],
        ].map(([k, v]) => (
          <p key={k} className="flex justify-between border-b-[0.3cqw] border-[#2a2620]/30 py-[1.6cqw] text-[3.4cqw]">
            <span>{k}</span>
            <span>{v}</span>
          </p>
        ))}
        <p className="mt-[3cqw] text-[3.2cqw] leading-[1.5]">
          섭취 방법: 1일 1회, 1회 2정을 물과 함께 섭취하십시오. 섭취 시 주의사항: 특정 질환이 있거나 의약품을 복용하는 경우 전문가와 상담하십시오.
        </p>
        <p className="mt-[2cqw] text-[2.9cqw] leading-[1.5] opacity-80">
          원재료명: 산화마그네슘, 결정셀룰로스, 콜레칼시페롤 혼합제제, 글루콘산아연, 스테아린산마그네슘, 피리독신염산염
        </p>
      </div>
    </div>
  );
}
