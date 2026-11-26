import SplashScreen from "./SplashScreen";

/** 사진 속 폰(화면은 투명) + 그 뒤에 끼운 HTML 화면. 히어로에서 흐린 판/선명한 판 두 번 쓴다. */
export default function PhoneStage({ priority = false }: { priority?: boolean }) {
  return (
    <div className="phone-stage">
      <div className="phone-screen">
        <SplashScreen />
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
  );
}
