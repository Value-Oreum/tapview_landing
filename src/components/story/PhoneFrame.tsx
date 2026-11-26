/** 스토리용 폰 프레임(사진). 화면 자리에 children을 끼운다. 너비는 className으로 정한다. */
export default function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[640/1295] ${className}`}>
      <div
        className="absolute overflow-hidden bg-[#121513]"
        style={{ left: "6.094%", top: "3.012%", width: "87.969%", height: "93.822%", containerType: "inline-size", borderRadius: "7%/3.4%" }}
      >
        {children}
      </div>
      <img
        src="/hero/phone-crop.webp"
        alt=""
        width={640}
        height={1295}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        draggable={false}
      />
    </div>
  );
}
