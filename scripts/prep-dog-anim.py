"""초록 배경에서 생성한 강아지 영상을 투명 배경의 움직이는 WebP로 만든다.

초록 빼기(chromakey) → 초록 번짐 제거(despill) → 흰색 톤 낮추기(크림색) → 15fps 움직이는 WebP.
움직이는 WebP는 크롬·사파리·파이어폭스 모두 투명도를 지원한다 (GIF는 가장자리가 거칠어 쓰지 않음).

사용: python -I scripts/prep-dog-anim.py <입력.mp4> <출력.webp> [--once] [--size 480] [--trim 시작초:끝초]
"""
import argparse
import os
import subprocess
import tempfile

from PIL import Image

# 흰 털을 크림색으로 낮춘다 (어두운 화면에서 튀지 않게). 검정·분홍은 거의 그대로.
TONE = "colorlevels=romax=0.93:gomax=0.905:bomax=0.85"

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--once", action="store_true", help="한 번만 재생하고 마지막 장면에서 멈춤")
ap.add_argument("--size", type=int, default=480)
ap.add_argument("--fps", type=int, default=15)
ap.add_argument("--trim", default="")
ap.add_argument("--similarity", type=float, default=0.17)
a = ap.parse_args()


def key_color(src):
    """첫 장면의 네 모서리에서 배경색을 잰다 (영상마다 초록 톤이 조금씩 다르다)"""
    tmp = os.path.join(tempfile.gettempdir(), f"tv_key_{os.getpid()}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-frames:v", "1", tmp], check=True)
    im = Image.open(tmp).convert("RGB")
    w, h = im.size
    px = [im.getpixel((x, y)) for x in (4, w // 2, w - 5) for y in (4, h - 5)]
    px += [im.getpixel((4, h // 2)), im.getpixel((w - 5, h // 2))]
    med = [sorted(c[i] for c in px)[len(px) // 2] for i in range(3)]
    return "0x%02X%02X%02X" % tuple(med)


KEY = key_color(a.src)
print("key", KEY)

vf = [
    f"fps={a.fps}",
    f"scale={a.size}:-2:flags=lanczos",
    f"chromakey={KEY}:{a.similarity}:0.07",
    "despill=type=green:mix=0.7:expand=0.15",
    "format=rgba",
    TONE,
]
cmd = ["ffmpeg", "-v", "error", "-y"]
if a.trim:
    s, e = a.trim.split(":")
    cmd += ["-ss", s, "-to", e]
cmd += [
    "-i", a.src,
    "-vf", ",".join(vf),
    "-an",
    "-c:v", "libwebp_anim",
    "-q:v", "72",
    "-compression_level", "6",
    "-loop", "1" if a.once else "0",
    a.out,
]
subprocess.run(cmd, check=True)
print("ok", a.out)
