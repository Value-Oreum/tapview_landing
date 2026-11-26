import { FAQ_COPY } from "@/components/sections/FaqSection";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

const DESC = {
  ko: "탭뷰는 45세 이상을 위한 안드로이드 읽기 보조 앱입니다. 두 화면 중 편한 쪽을 탭하면 글자 크기·바탕·또렷함이 내 눈에 맞춰지고, 읽으려고 멈췄을 때 원래 화면을 내 설정으로 다시 보여 줍니다. 의료기기가 아닙니다.",
  ja: "TapViewは、45歳以上の方のためのAndroid向け読みやすさサポートアプリです。2つの画面から楽な方をタップするだけで、文字の大きさ・背景・くっきり度が自分の目に合い、読もうと手を止めたときにもとの画面を自分の設定で表示し直します。医療機器ではありません。",
} as const;

/**
 * 검색엔진·AI 답변 엔진이 읽는 구조화 데이터(JSON-LD).
 * 운영 주체, 웹사이트, 앱(출시 전), 자주 묻는 질문을 한 묶음으로 넣는다.
 */
export default function JsonLd({ lang = "ko" }: { lang?: Lang }) {
  const home = lang === "ja" ? `${SITE_URL}/ja` : SITE_URL;
  const org = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: "탭뷰 TapView",
    alternateName: ["TapView", "탭뷰", "タップビュー"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: CONTACT_EMAIL,
    description: DESC[lang],
    foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "KR" } },
  };
  const website = {
    "@type": "WebSite",
    "@id": `${home}#website`,
    url: home,
    name: lang === "ja" ? "TapView（タップビュー）" : "탭뷰 TapView",
    inLanguage: lang,
    publisher: { "@id": `${SITE_URL}/#org` },
  };
  const app = {
    "@type": "MobileApplication",
    "@id": `${SITE_URL}/#app`,
    name: "TapView",
    alternateName: lang === "ja" ? "タップビュー" : "탭뷰",
    operatingSystem: "Android",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: lang === "ja" ? "読みやすさサポート・ユーザー補助" : "읽기 보조·접근성",
    description: DESC[lang],
    inLanguage: lang,
    url: home,
    image: `${SITE_URL}/icon-512.png`,
    publisher: { "@id": `${SITE_URL}/#org` },
    audience: { "@type": "PeopleAudience", suggestedMinAge: 45 },
    ...(lang === "ko"
      ? {
          offers: {
            "@type": "Offer",
            price: "9900",
            priceCurrency: "KRW",
            availability: "https://schema.org/PreOrder",
            availabilityStarts: "2027-06",
            description: "연간 이용권(7일 무료 체험). 사전 예약 시 출시 후 첫 1년 무료.",
            url: `${SITE_URL}/reserve`,
          },
        }
      : {}),
  };
  const faq = {
    "@type": "FAQPage",
    "@id": `${home}#faq`,
    inLanguage: lang,
    mainEntity: FAQ_COPY[lang].faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const data = { "@context": "https://schema.org", "@graph": [org, website, app, faq] };
  return (
    <script
      type="application/ld+json"
      // JSON 안의 '<'를 바꿔 스크립트가 일찍 닫히지 않게 한다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
