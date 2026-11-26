import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/reserve/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "탭뷰 제휴·취재·복지관 도입 문의. tapview@tapview.app으로도 받습니다.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "문의하기 · 탭뷰 TapView", url: "https://tapview.app/contact", images: [OG_IMAGE.ko] },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pt-36 pb-24 sm:px-10 sm:pt-44">
        <div className="mx-auto max-w-[760px]">
          <p className="text-[0.9375rem] font-semibold tracking-[0.04em] text-mint/80">문의하기</p>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-paper">
            무엇이든 물어봐 주세요.
          </h1>
          <p className="mt-4 text-[1.125rem] text-paper/65">
            제휴·취재·기관 도입 문의 모두 환영합니다. 메일로 바로 보내셔도 됩니다:{" "}
            <a href="mailto:tapview@tapview.app" className="text-paper underline underline-offset-4">
              tapview@tapview.app
            </a>
          </p>
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
