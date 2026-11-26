import ScrollFocusText from "@/components/motion/ScrollFocusText";

/** 섹션 머리: 작은 표지 + 흐림→선명 제목 + 설명 */
export default function SectionHead({
  id,
  eyebrow,
  title,
  desc,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={align === "center" ? "mx-auto max-w-[48rem] text-center" : "max-w-[52rem]"}>
      <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">{eyebrow}</p>
      <h2 id={id} className="mt-4">
        <ScrollFocusText
          as="span"
          text={title}
          start="top 90%"
          end="top 50%"
          className="block text-[clamp(2rem,4.8vw,4rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-paper"
        />
      </h2>
      {desc && <p className="mt-6 text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.65] text-paper/70">{desc}</p>}
    </header>
  );
}
