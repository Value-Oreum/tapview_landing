export default function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 px-5 pt-14 pb-[max(40px,env(safe-area-inset-bottom))] sm:px-10">
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
      <p className="mx-auto mt-10 max-w-[1240px] text-[0.8125rem] text-paper/35">© 2026 TapView. 탭뷰는 의료기기가 아닌 화면 읽기 보조 앱입니다.</p>
    </footer>
  );
}
