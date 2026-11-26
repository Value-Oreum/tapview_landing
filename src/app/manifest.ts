import type { MetadataRoute } from "next";

/** 홈 화면에 추가할 때의 이름·아이콘 (아이콘은 scripts/make-icons.py로 만든다) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "탭뷰 TapView",
    short_name: "TapView",
    description: "탭하면, 내 눈에 맞는 화면. 작은 글씨에 멈추는 순간을 줄이는 안드로이드 읽기 보조 앱.",
    start_url: "/",
    display: "standalone",
    background_color: "#060807",
    theme_color: "#060807",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
