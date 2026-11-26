import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DoneView from "@/components/reserve/DoneView";

export const metadata: Metadata = {
  title: "첫눈도장 완료",
  robots: { index: false },
};

export default function DonePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden px-5 pt-36 pb-28 sm:px-10 sm:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 50% at 30% 30%, rgb(255 212 90 / 0.08), transparent 70%)" }}
        />
        <div className="relative">
          <DoneView />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
