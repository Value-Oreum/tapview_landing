import { DogClip } from "@/components/DogMotion";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-paper/10 px-5 pt-14 pb-[max(40px,env(safe-area-inset-bottom))] sm:px-10">
      <DogClip clip="sleep" className="absolute -top-[74px] right-6 h-24 w-24 sm:right-16 sm:h-28 sm:w-28 sm:-top-[86px]" />
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/brand/logo-white.png" alt="TapView" width={640} height={222} className="h-7 w-auto" />
          <p className="mt-4 text-[1.0625rem] text-paper/70">선명하게 보이면, 탭.</p>
          <p className="mt-6 text-[0.9375rem] leading-[1.8] text-paper/50">
            탭뷰 팀 (예비창업)
            <br />
            <a href="mailto:tapview@tapview.app" className="underline-offset-4 hover:text-paper hover:underline">
              tapview@tapview.app
            </a>
          </p>
        </div>
        <nav aria-label="하단 메뉴" className="flex flex-wrap gap-x-6 gap-y-3 text-[0.9375rem] text-paper/65">
          <a href="/reserve" className="hover:text-paper">사전 예약</a>
          <a href="/reserve?type=org" className="hover:text-paper">기관 신청</a>
          <a href="/contact" className="hover:text-paper">문의하기</a>
          <a href="/privacy" className="font-semibold text-paper/85 hover:text-paper">개인정보처리방침</a>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] space-y-1.5 border-t border-paper/10 pt-6 text-[0.8125rem] leading-[1.7] text-paper/40">
        <p>특허 출원 중 · 출원번호 10-2026-0240614 (2026. 11. 26.)</p>
        <p>탭뷰는 의료기기가 아닌 화면 읽기 보조 앱입니다.</p>
        <p>
          이 사이트의 글, 디자인, 이미지, 캐릭터, 영상의 저작권은 탭뷰 팀에 있습니다. 허락 없이 복제·배포·변형하거나 다른 곳에
          쓸 수 없습니다.
        </p>
        <p className="text-paper/55">© 2026 탭뷰 TapView. All rights reserved.</p>
      </div>
    </footer>
  );
}
