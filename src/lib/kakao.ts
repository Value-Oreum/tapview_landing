/**
 * 카카오톡 공유 (Kakao JavaScript SDK 2.8.5).
 * NEXT_PUBLIC_KAKAO_JS_KEY 가 있을 때만 불러온다. 키가 없으면 null → 휴대폰 공유창으로 대신 보낸다.
 * 카카오 개발자 콘솔: JavaScript SDK 도메인 + 제품 링크 관리 ▸ 웹 도메인에 https://tapview.app 등록 필요.
 */
const SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js";
const SRI = "sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj";
export const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";

export type KakaoSDK = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(template: Record<string, unknown>): void;
    uploadImage(opts: { file: File[] }): Promise<{ infos: { original: { url: string; width?: number; height?: number } } }>;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

let loading: Promise<KakaoSDK | null> | null = null;

export function loadKakao(): Promise<KakaoSDK | null> {
  if (!KAKAO_KEY || typeof window === "undefined") return Promise.resolve(null);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const ready = () => {
      const K = window.Kakao;
      if (!K) return resolve(null);
      try {
        if (!K.isInitialized()) K.init(KAKAO_KEY);
        resolve(K);
      } catch {
        resolve(null);
      }
    };
    if (window.Kakao) return ready();
    const s = document.createElement("script");
    s.src = SRC;
    s.integrity = SRI;
    s.crossOrigin = "anonymous";
    s.async = true;
    s.onload = ready;
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loading;
}
