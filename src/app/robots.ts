import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const DISALLOW = ["/api/", "/reserve/done"];

/** 검색엔진과 AI 검색·답변 엔진(GEO) 모두 허용. 접수 API와 완료 화면만 제외 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      {
        userAgent: [
          "Googlebot",
          "Yeti", // 네이버
          "Daumoa", // 다음
          "Bingbot",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
