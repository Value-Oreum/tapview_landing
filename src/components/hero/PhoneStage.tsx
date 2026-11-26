import SplashScreen from "./SplashScreen";
import HeroDog from "./HeroDog";
import type { Lang } from "@/lib/i18n";

/** 사진 속 폰(화면은 투명) + 그 뒤에 끼운 HTML 화면 + 렌즈 가운데의 강아지. 흐린 판/선명한 판에 두 번 쓴다. */
export default function PhoneStage({ priority = false, lang = "ko" }: { priority?: boolean; lang?: Lang }) {
  return (
    <>
      <div className="phone-stage">
        <div className="phone-screen">
          <SplashScreen lang={lang} />
        </div>
        <img
          src="/hero/phone.webp"
          alt=""
          width={2720}
          height={1536}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
        />
      </div>
      <HeroDog />
    </>
  );
}
