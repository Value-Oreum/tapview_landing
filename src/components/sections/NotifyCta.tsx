import Dog from "@/components/Dog";
import ScrollFocusText from "@/components/motion/ScrollFocusText";
import Reveal from "@/components/motion/Reveal";

/** 일본어 페이지 마지막 CTA — 한국어의 '첫눈에 탭!' 혜택 대신 일본 출시 알림·제휴 상담 */
export default function NotifyCta() {
  return (
    <section id="join" aria-labelledby="join-title" className="relative overflow-hidden px-5 py-[18vh] sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 55% at 50% 30%, rgb(139 242 194 / 0.08), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-[52rem] text-center">
          <p className="inline-flex rounded-full bg-tap px-4 py-1.5 text-[1rem] font-extrabold text-ink">日本版のお知らせ</p>
          <h2 id="join-title" className="mt-6">
            <ScrollFocusText
              as="span"
              text={"日本でのリリースを、\nいちばん先にお知らせします。"}
              start="top 90%"
              end="top 50%"
              className="block text-[clamp(2rem,5vw,4.25rem)] leading-[1.12] font-semibold tracking-[-0.04em] text-paper"
            />
          </h2>
        </div>

        <Reveal className="mt-16 grid gap-5 md:grid-cols-2" stagger={0.15}>
          <article data-reveal className="relative flex flex-col rounded-[36px] border border-paper/12 bg-paper/[0.04] p-8 pt-24 sm:p-10 sm:pt-28">
            <Dog pose="gift" motion="hop" className="absolute -top-10 left-6 h-36 w-36 sm:h-40 sm:w-40" />
            <p className="text-[0.9375rem] font-semibold text-mint/80">個人の方</p>
            <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-paper">リリースのお知らせ</h3>
            <p className="mt-4 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.35] font-semibold text-paper">
              日本版のリリースを、<span className="text-mint">いち早く</span>
            </p>
            <p className="mt-2 text-[1.0625rem] text-paper/70">
              メールアドレスだけで登録できます。日本でのテスター募集のご案内もお送りします。
            </p>
            <div className="mt-auto pt-8">
              <a
                href="/ja/notify"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-paper text-[1.0625rem] font-extrabold text-forest transition-transform hover:scale-[1.02] sm:w-auto sm:px-8"
              >
                お知らせを受け取る
              </a>
            </div>
          </article>

          <article data-reveal className="relative flex flex-col rounded-[36px] border border-mint/30 bg-gradient-to-b from-forest/50 to-paper/[0.02] p-8 pt-24 sm:p-10 sm:pt-28">
            <Dog pose="cape" motion="float" className="absolute -top-12 left-6 h-36 w-36 sm:h-40 sm:w-40" delay={0.15} />
            <p className="text-[0.9375rem] font-semibold text-mint/80">企業・団体の方</p>
            <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-paper">提携・導入のご相談</h3>
            <p className="mt-4 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.35] font-semibold text-paper">
              日本で<span className="text-mint">一緒に広げる</span>パートナーを
            </p>
            <p className="mt-2 text-[1.0625rem] text-paper/70">
              福祉・介護施設、自治体、通信事業者・端末メーカー、アプリ事業者の方からのご相談をお待ちしています。
            </p>
            <div className="mt-auto pt-8">
              <a
                href="/ja/notify?type=partner"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-mint/60 text-[1.0625rem] font-extrabold text-mint transition-colors hover:bg-mint hover:text-ink sm:w-auto sm:px-8"
              >
                相談する
              </a>
            </div>
          </article>
        </Reveal>
        <p className="mt-8 text-center text-[0.9375rem] leading-[1.7] text-paper/50">
          ご登録いただいた情報は、日本でのリリースや提携に関するご連絡にのみ使用します。
        </p>
      </div>
    </section>
  );
}
