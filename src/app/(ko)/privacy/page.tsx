import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "개인정보처리방침" };

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "1. 처리 목적",
    body: (
      <ul>
        <li>사전 예약(첫 눈도장) 접수 확인, 출시·혜택 안내</li>
        <li>체험단(평생 눈도장) 선발과 연락</li>
        <li>복지관·기관 도입 상담, 문의 응대</li>
        <li>개발 소식 메일 발송 (선택 동의한 경우에만)</li>
      </ul>
    ),
  },
  {
    h: "2. 처리하는 항목",
    body: (
      <ul>
        <li>필수: 이름, 휴대폰 번호, 이메일 / 기관 신청은 기관명, 담당자 이름, 연락처, 이메일, 지역</li>
        <li>선택: 연령대, 휴대폰 기종, 화면이 불편한 상황, 알게 된 경로, 체험단 신청 여부와 한 줄 사연</li>
        <li>가족 대리 신청: 사용하실 분과의 관계, 사용하실 분의 연령대·기종·불편한 상황</li>
        <li>자동 수집: 유입 경로(utm), 초대 코드, 브라우저 정보</li>
      </ul>
    ),
  },
  {
    h: "3. 보유 기간",
    body: (
      <p>
        사전 예약·체험단·기관 신청 정보는 출시 후 혜택 안내를 마칠 때까지 보관하며, 늦어도 2028년 12월 31일에 파기합니다. 문의 내용은 답변 후
        1년 안에 파기합니다. 동의를 철회하시면 지체 없이 파기합니다.
      </p>
    ),
  },
  {
    h: "4. 제3자 제공",
    body: <p>개인정보를 제3자에게 제공하지 않습니다.</p>,
  },
  {
    h: "5. 처리 위탁과 국외 이전",
    body: (
      <>
        <p>신청 접수와 안내를 위해 아래 업체의 서비스를 이용하며, 이 과정에서 개인정보가 국외(미국)로 이전·보관됩니다.</p>
        <ul>
          <li>Google LLC (미국): 신청 내용 저장(Google 스프레드시트), 확인·안내 메일 발송(Gmail)</li>
          <li>Vercel Inc. (미국): 웹사이트 운영과 신청 전송</li>
        </ul>
        <p>
          이전 항목은 2번의 항목이며, 신청하실 때 네트워크로 전송됩니다. 보유 기간은 3번과 같습니다. 국외 이전에 동의하지 않으시면 온라인
          신청이 어려우니 tapview@tapview.app으로 연락 주세요.
        </p>
      </>
    ),
  },
  {
    h: "6. 파기 방법",
    body: <p>전자 파일은 복구할 수 없는 방법으로 삭제합니다.</p>,
  },
  {
    h: "7. 정보주체의 권리",
    body: (
      <p>
        언제든 개인정보 열람, 정정, 삭제, 처리 정지와 동의 철회를 요청하실 수 있습니다. tapview@tapview.app으로 보내 주시면 지체 없이
        처리합니다. 소식 메일은 메일 하단에서도 수신을 거부할 수 있습니다.
      </p>
    ),
  },
  {
    h: "8. 만 14세 미만",
    body: <p>만 14세 미만 아동의 신청은 받지 않습니다.</p>,
  },
  {
    h: "9. 방문 통계",
    body: <p>사이트 개선을 위해 쿠키를 쓰지 않는 익명 방문 통계(Vercel Web Analytics)를 사용합니다.</p>,
  },
  {
    h: "10. 개인정보 보호책임자",
    body: (
      <p>
        탭뷰 팀(예비창업) 대표 · tapview@tapview.app
        <br />
        개인정보 침해 신고와 상담은 개인정보침해신고센터(국번 없이 118, privacy.kisa.or.kr)에도 하실 수 있습니다.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pt-36 pb-24 sm:px-10 sm:pt-44">
        <article className="mx-auto max-w-[820px]">
          <h1 className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold tracking-[-0.04em] text-paper">개인정보처리방침</h1>
          <p className="mt-4 text-[1.0625rem] text-paper/60">
            탭뷰 팀(이하 &apos;탭뷰&apos;)은 사전 예약과 문의를 처리하며 「개인정보 보호법」을 지킵니다. 시행일 2026년 11월 26일.
          </p>
          <div className="mt-12 grid gap-10 text-[1.0625rem] leading-[1.8] text-paper/80 [&_li]:mt-1 [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_ul+p]:mt-3">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="mb-3 text-[1.25rem] font-semibold text-paper">{s.h}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
