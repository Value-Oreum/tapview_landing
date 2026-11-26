import SectionHead from "./SectionHead";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import type { Lang } from "@/lib/i18n";

type Stat = { v: number; unit: string; label: string; accent?: boolean };

const T: Record<Lang, { eyebrow: string; title: string; desc: string; stats: Stat[]; src: string }> = {
  ko: {
    eyebrow: "시장",
    title: "작은 화면 앞에서 멈추는 사람은,\n생각보다 많습니다.",
    desc: "노안이 시작되는 45세 이상이 탭뷰의 첫 사용자입니다. 국내 안드로이드에서 시작해 일본으로 넓힙니다.",
    stats: [
      { v: 2580, unit: "만 명", label: "국내 45세 이상 스마트폰 사용자" },
      { v: 2190, unit: "만 명", label: "그중 갤럭시 등 안드로이드 사용자", accent: true },
      { v: 3360, unit: "만 명", label: "일본 45세 이상 안드로이드 사용자" },
    ],
    src: "추정 출처: 행정안전부 주민등록인구(2026.10), 방송통신위원회 방송매체 이용행태조사, 한국갤럽(2025.7), 일본 총무성, 모바일사회연구소(2026.1). 해외에서는 큰 글씨 안드로이드 런처 BIG Launcher가 Google Play에서 100만 회 이상 설치되었습니다(개발사 발표 200만).",
  },
  ja: {
    eyebrow: "市場",
    title: "小さな画面の前で手が止まる人は、\n思ったより多いのです。",
    desc: "老眼が始まる45歳以上が、TapViewの最初のユーザーです。韓国のAndroidから始め、日本へ広げます。",
    stats: [
      { v: 3360, unit: "万人", label: "日本の45歳以上のAndroidユーザー", accent: true },
      { v: 2580, unit: "万人", label: "韓国の45歳以上のスマホユーザー" },
      { v: 2190, unit: "万人", label: "うち韓国のAndroidユーザー" },
    ],
    src: "推計の出典：韓国 行政安全部 住民登録人口（2026年10月）、韓国 放送通信委員会 放送媒体利用行態調査、韓国ギャラップ（2025年7月）、日本 総務省、モバイル社会研究所（2026年1月）。海外では、大きな文字のAndroidランチャー「BIG Launcher」がGoogle Playで100万回以上インストールされています（開発元の発表では200万）。",
  },
};

export default function MarketSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <section id="market" aria-labelledby="market-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead id="market-title" eyebrow={t.eyebrow} title={t.title} desc={t.desc} />
        <Reveal className="mt-16 grid gap-10 border-t border-paper/10 pt-12 md:grid-cols-3 md:gap-6">
          {t.stats.map((s) => (
            <div key={s.label} data-reveal>
              <p className={`text-[clamp(3rem,7vw,6rem)] leading-none font-light tracking-[-0.04em] ${s.accent ? "text-mint" : "text-paper"}`}>
                <CountUp value={s.v} />
                <span className="ml-1 text-[0.38em] font-semibold tracking-[-0.02em]">{s.unit}</span>
              </p>
              <p className="mt-4 text-[1.125rem] text-paper/75">{s.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-10 text-[0.875rem] leading-[1.7] text-paper/45">{t.src}</p>
      </div>
    </section>
  );
}
