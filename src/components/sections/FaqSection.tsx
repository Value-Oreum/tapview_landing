import SectionHead from "./SectionHead";
import { DogPeek } from "@/components/DogMotion";
import type { Lang } from "@/lib/i18n";

const T = {
  ko: {
    eyebrow: "자주 묻는 질문",
    title: "궁금한 점,\n먼저 답해 드립니다.",
    faq: [
      {
        q: "언제 쓸 수 있나요?",
        a: "2027년 6월 앱 장터 정식 출시가 목표입니다. 그 전에 전국 복지관 어르신들이 무료로 쓰실 수 있도록 복지관과 함께 먼저 시작하고, 체험단(평생 눈도장)으로도 먼저 써 보실 수 있습니다. 사전 예약하시면 출시 소식을 가장 먼저 알려 드립니다.",
      },
      {
        q: "가격은 얼마인가요?",
        a: "연간 9,900원입니다(7일 무료 체험 후 구매). 매달 빠져나가는 구독이 아니라 1년에 한 번 결제합니다. 사전 예약(첫 눈도장)하시면 출시 후 첫 1년이 무료이고, 체험단(평생 눈도장)으로 함께하시는 분은 평생 무료입니다. 모두 본인과 가족 2명까지.",
      },
      {
        q: "아이폰에서도 되나요?",
        a: "갤럭시 등 안드로이드부터 시작합니다. 아이폰은 같은 엔진으로 이후 지원을 검토합니다. 사전 예약 때 기종을 남겨 주시면 아이폰 소식도 따로 알려 드립니다.",
      },
      {
        q: "시력을 재거나 눈을 치료하는 앱인가요?",
        a: "아닙니다. 시력을 재거나 고치는 앱이 아니라, 스마트폰 화면을 읽기 편하게 맞추는 읽기 보조 앱입니다. 눈에 불편이 있으시면 안과 진료를 함께 받으시길 권합니다.",
      },
      {
        q: "은행 앱에서도 되나요?",
        a: "보안 키패드와 보안 화면에서는 안전을 위해 탭뷰 표시를 끄고 휴대폰 기본 확대 기능을 안내합니다.",
      },
      {
        q: "제 화면 내용이 밖으로 나가나요?",
        a: "화면 원문과 입력 내용은 기기 밖으로 보내지 않습니다. 서버는 계정, 설정 동기화, 결제, 가족 연결만 맡습니다.",
      },
      {
        q: "체험단(평생 눈도장)은 어떻게 뽑나요?",
        a: "사전 예약 때 '체험단 참여'를 체크한 분 가운데 기종·연령대·사용 상황을 고려해 5명 → 30명 → 100명 순서로 선발합니다. 정해진 기간 동안 쓰고 의견을 주시면 평생 무료(본인과 가족 2명)입니다.",
      },
      {
        q: "부모님 대신 신청할 수 있나요?",
        a: "네. 사전 예약에서 '가족 대리 신청'을 고르시면 됩니다. 사용하실 분의 동의를 먼저 받아 주세요.",
      },
    ],
  },
  ja: {
    eyebrow: "よくある質問",
    title: "気になることに、\n先にお答えします。",
    faq: [
      {
        q: "いつ使えますか？",
        a: "まず2027年6月に韓国でリリースする予定です。日本では2028年下半期のリリースを目指しています（予定）。お知らせ登録をしていただくと、日本でのリリース情報をいち早くお届けします。",
      },
      {
        q: "料金はいくらですか？",
        a: "日本での料金は、リリース時にお知らせします。韓国では年額9,900ウォン（7日間の無料体験のあと購入）で、毎月引き落とされるサブスクリプションではなく、年に1回のお支払いです。",
      },
      {
        q: "iPhoneでも使えますか？",
        a: "Galaxyなど、Androidから始めます。iPhoneは同じエンジンで、その後の対応を検討しています。",
      },
      {
        q: "視力を測ったり、目を治したりするアプリですか？",
        a: "いいえ。視力を測ったり治したりするアプリではなく、スマホの画面を読みやすく整える読みやすさサポートアプリです。目に気になる症状があれば、眼科の受診もあわせておすすめします。",
      },
      {
        q: "銀行アプリでも使えますか？",
        a: "セキュリティキーボードや保護された画面では、安全のためTapViewの表示をオフにし、スマホ標準の拡大機能をご案内します。",
      },
      {
        q: "画面の内容が外部に送られることはありますか？",
        a: "画面の文章や入力内容は、端末の外に送りません。サーバーが扱うのは、アカウント、設定の同期、決済、家族との連携だけです。",
      },
      {
        q: "日本でもテストに参加できますか？",
        a: "日本向けのテスター募集を予定しています。お知らせ登録をしていただいた方に、先にご案内します。",
      },
      {
        q: "家族の代わりに登録できますか？",
        a: "はい。お知らせ登録の「メモ」に、ご家族のための登録であることを書いていただければ、ご家族向けの情報もあわせてお送りします。",
      },
    ],
  },
} as const;

export default function FaqSection({ lang = "ko" }: { lang?: Lang }) {
  const t = T[lang];
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-5 py-[16vh] sm:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <SectionHead id="faq-title" eyebrow={t.eyebrow} title={t.title} />
        <div className="relative divide-y divide-paper/10 border-y border-paper/10">
          <DogPeek pose="dazed" size={120} className="right-6" />
          {t.faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.125rem,1.6vw,1.375rem)] font-semibold text-paper">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-paper/20 text-paper/70 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 text-[1.0625rem] leading-[1.75] text-paper/72">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
