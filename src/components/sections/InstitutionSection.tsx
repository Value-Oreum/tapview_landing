import SectionHead from "./SectionHead";
import Reveal from "@/components/motion/Reveal";
import Dog from "@/components/Dog";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    eyebrow: "복지관 · 기관",
    title: "복지관 교실에서 먼저,\n10분이면 함께 맞춥니다.",
    desc: "대표가 사회복지사라서, 가장 먼저 만나는 곳은 복지관입니다. 스마트폰 교실에서 강사·사회복지사와 함께 설치하고, 집에서는 혼자 매일 씁니다.",
    steps: ["강사 QR로 설치", "3개월 무료 체험 시작", "편한 그림 2~3번 탭", "내 화면 완성"],
    adminTitle: "복지관 전용 관리자 화면을 제공해 드립니다.",
    features: [
      {
        t: "누가 어디까지 했는지 한눈에",
        d: "어르신마다 설치를 마쳤는지, 내 화면을 완성했는지, 일주일 뒤에도 잘 쓰고 계신지 한 화면에서 확인합니다.",
      },
      { t: "도움이 필요한 분만 골라서", d: "설치나 설정에서 막힌 분만 따로 보여 드려서, 사회복지사 한 사람이 많은 분을 챙길 수 있습니다." },
      {
        t: "수업 진행과 실적 보고까지",
        d: "수업 때 강사 화면에 QR과 진행 순서를 띄우고, 복지관 사업 실적 보고에 바로 쓰는 이용 리포트를 만들어 드립니다.",
      },
    ],
    consent: "원격으로 다시 맞추기는 본인이 동의했을 때만 합니다.",
    status: "협약 추진 중",
    statusLine1: "성남·대구·충남권 복지관과",
    statusLine2: "협약을 추진하고 있습니다.",
    regions: ["성남", "대구", "충남권"],
    partners: [
      "(주)뉴로아시스 업무협약 — 복지관·요양시설 현장 실증 (2026.11)",
      "대구보건대학교 안경광학과 — 화면 가독성 설계 자문 협력 (2026.11)",
    ],
    cta: "기관 신청하기",
    ctaHref: "/reserve?type=org",
  },
  ja: {
    eyebrow: "福祉館・施設",
    title: "韓国では、福祉館の教室から。\n10分で一緒に合わせます。",
    desc: "代表が社会福祉士なので、最初に届ける先は韓国の福祉館（地域の福祉センター）です。スマホ教室で講師や社会福祉士と一緒に設定し、家ではひとりで毎日使います。日本でも、地域の施設や教室と一緒に同じしくみを広げていきます。",
    steps: ["講師のQRでインストール", "3か月の無料体験スタート", "楽な画面を2〜3回タップ", "自分の画面が完成"],
    adminTitle: "福祉館専用の管理画面をご用意します。",
    features: [
      {
        t: "誰がどこまで進んだか、ひと目で",
        d: "参加者ごとに、インストールが済んだか、自分の画面ができたか、1週間後も使えているかを1つの画面で確認できます。",
      },
      {
        t: "助けが必要な方だけを絞り込み",
        d: "インストールや設定でつまずいた方だけを表示するので、社会福祉士1人でも多くの方をサポートできます。",
      },
      {
        t: "授業の進行から実績報告まで",
        d: "授業では講師の画面にQRコードと進め方を表示し、福祉館の事業実績報告にそのまま使える利用レポートを作成します。",
      },
    ],
    consent: "遠隔での再設定は、ご本人が同意した場合のみ行います。",
    status: "協約を推進中",
    statusLine1: "韓国の城南・大邱・忠南エリアの",
    statusLine2: "福祉館と協約を進めています。",
    regions: ["城南", "大邱", "忠南エリア"],
    partners: [
      "（株）ニューロアシス 業務協約 — 福祉館・介護施設での現場実証（2026年11月）",
      "大邱保健大学 眼鏡光学科 — 画面の読みやすさ設計の助言・協力（2026年11月）",
    ],
    cta: "日本での導入・提携のご相談",
    ctaHref: "/ja/notify?type=partner",
  },
} as const;

export default function InstitutionSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <section id="institution" aria-labelledby="inst-title" className="relative overflow-hidden px-5 py-[16vh] sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead id="inst-title" eyebrow={t.eyebrow} title={t.title} desc={t.desc} />

        <Reveal as="ol" className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4" stagger={0.12}>
          {t.steps.map((s, i) => (
            <li key={s} data-reveal className="rounded-[24px] border border-paper/10 bg-paper/[0.03] p-6">
              <span className="text-[0.9375rem] font-semibold text-mint/80">{i + 1}</span>
              <p className="mt-2 text-[1.1875rem] font-semibold text-paper">{s}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Reveal>
            <h3 data-reveal className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.03em] text-paper">
              {t.adminTitle}
            </h3>
            <ul className="mt-8 grid gap-6">
              {t.features.map((f) => (
                <li key={f.t} data-reveal className="border-l-2 border-mint/40 pl-6">
                  <p className="text-[1.25rem] font-semibold text-paper">{f.t}</p>
                  <p className="mt-2 text-[1.0625rem] leading-[1.65] text-paper/70">{f.d}</p>
                </li>
              ))}
            </ul>
            <p data-reveal className="mt-8 text-[0.9375rem] text-paper/50">
              {t.consent}
            </p>
          </Reveal>

          <Reveal className="relative rounded-[32px] border border-paper/10 bg-gradient-to-b from-forest/40 to-transparent p-8 sm:p-10">
            <p data-reveal className="text-[0.9375rem] font-semibold text-mint/80">
              {t.status}
            </p>
            <p data-reveal className="mt-3 text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.35] font-semibold tracking-[-0.02em] text-paper">
              {t.statusLine1}
              <br />
              {t.statusLine2}
            </p>
            <ul data-reveal className="mt-6 flex flex-wrap gap-2">
              {t.regions.map((r) => (
                <li key={r} className="rounded-full border border-mint/40 px-4 py-1.5 text-[0.9375rem] font-semibold text-mint">
                  {r}
                </li>
              ))}
            </ul>
            <ul data-reveal className="mt-8 grid gap-2 text-[0.9375rem] leading-[1.6] text-paper/65">
              {t.partners.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
            <a
              data-reveal
              href={t.ctaHref}
              className="mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-paper py-2 pr-2 pl-7 text-[1.0625rem] font-extrabold text-forest transition-transform hover:scale-[1.02]"
            >
              {t.cta}
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-paper" aria-hidden>
                →
              </span>
            </a>
            <Dog pose="heart" motion="wiggle" className="absolute -top-14 right-4 h-28 w-28 sm:right-8 sm:h-32 sm:w-32" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
