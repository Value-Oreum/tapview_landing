/** 초대 코드(?ref=)를 30일 동안 기억했다가 신청 때 함께 보낸다 */
const DAYS = 30;

export function readRef(): string {
  try {
    const raw = localStorage.getItem("tv-ref");
    if (raw) {
      const { ref, at } = JSON.parse(raw) as { ref?: string; at?: number };
      if (ref && at && Date.now() - at < DAYS * 864e5) return ref;
    }
    return sessionStorage.getItem("tv-ref") || "";
  } catch {
    return "";
  }
}
