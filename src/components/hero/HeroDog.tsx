/**
 * 히어로 강아지 층. 렌즈 가운데에 크게 놓인다(위치·크기는 Hero가 CSS 변수로 넘김).
 * 처음에는 자는 정지 그림, 이어서 '깨어나 손 흔들기' 영상(움직이는 WebP) → '손 흔들기 반복' 영상.
 * 흐린 판과 선명한 판에 한 벌씩 있고, Hero가 둘을 같은 순간에 바꾼다.
 */
export default function HeroDog() {
  return (
    <div className="hero-dog" data-hero-dog aria-hidden="true">
      <img src="/dog/dog-sleep.webp" alt="" width={512} height={512} draggable={false} data-dog-still />
      <img alt="" width={480} height={480} draggable={false} data-dog-anim className="opacity-0" />
      <img src="/dog/dog-wave.webp" alt="" width={512} height={512} draggable={false} data-dog-final className="dog-final" />
    </div>
  );
}
