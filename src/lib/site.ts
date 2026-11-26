/** 검색·공유·구조화 데이터에 쓰는 사이트 기본값 */
export const SITE_URL = "https://tapview.app";
export const CONTACT_EMAIL = "tapview@tapview.app";
/** 마지막으로 내용을 크게 고친 날 (sitemap lastModified) */
export const UPDATED = "2026-11-26";

/** 공유 미리보기 이미지 (1200×630). 하위 페이지가 openGraph를 따로 정해도 빠지지 않게 늘 함께 넣는다 */
export const OG_IMAGE = {
  ko: { url: "/og-ko.jpg", width: 1200, height: 630, alt: "탭뷰 TapView 로고와 '탭하면, 내 눈에 맞는 화면'" },
  ja: { url: "/og-ja.jpg", width: 1200, height: 630, alt: "TapView（タップビュー）のロゴと「タップすれば、自分の目に合う画面」" },
} as const;
