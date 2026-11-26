/** 사이트 언어. 한국어가 기본이고, 일본어 페이지(/ja)는 같은 컴포넌트에 lang="ja"를 넘긴다. */
export type Lang = "ko" | "ja";

/** 언어별 경로: 홈·처리방침 등 */
export const HOME: Record<Lang, string> = { ko: "/", ja: "/ja" };
export const PRIVACY: Record<Lang, string> = { ko: "/privacy", ja: "/ja/privacy" };
/** 주 행동 버튼: 한국어는 사전 예약, 일본어는 출시 알림 */
export const PRIMARY: Record<Lang, string> = { ko: "/reserve", ja: "/ja/notify" };
