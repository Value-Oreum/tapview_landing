"""강아지 캐릭터(512px 투명 PNG)를 사이트용 webp로 만든다.

히어로에 쓰는 4포즈는 효과 표시(Zzz, 점, 별, 손 흔드는 선)를 몸통에서 떼어
'-body', '-fx' 두 장으로도 저장한다 (같은 512 캔버스라 겹치면 원본과 같다).
효과 표시는 알파 연결 요소의 중심이 지정한 사각형 안에 있는 것으로 고른다.

사용: python -I scripts/prep-dog.py <512 PNG 폴더> <출력 폴더>
"""
import glob
import os
import sys
from collections import deque

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

# 효과 표시 영역 (512 기준 x0, y0, x1, y1)
FX = {
    "sleep": (20, 60, 160, 220),   # Zzz
    "dazed": (410, 260, 470, 380),  # 점 세 개
    "jump": (335, 110, 440, 250),   # 별
    "wave": (380, 170, 460, 290),   # 손 흔드는 선
}


def components(alpha):
    h, w = alpha.shape
    lab = np.zeros((h, w), np.int32)
    comps = []
    cur = 0
    ys, xs = np.nonzero(alpha > 8)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]:
            continue
        cur += 1
        q = deque([(y0, x0)])
        lab[y0, x0] = cur
        pts = []
        while q:
            y, x = q.popleft()
            pts.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] > 8 and not lab[ny, nx]:
                        lab[ny, nx] = cur
                        q.append((ny, nx))
        p = np.array(pts)
        comps.append((cur, p[:, 1].mean(), p[:, 0].mean(), len(pts)))
    return lab, comps


# 흰 털을 크림색으로 낮춘다 (어두운 화면에서 튀지 않게). 영상(prep-dog-anim.py)과 같은 값.
TONE = (0.93, 0.905, 0.85)


def tone(im):
    a = np.asarray(im).astype(np.float32)
    a[..., 0] *= TONE[0]
    a[..., 1] *= TONE[1]
    a[..., 2] *= TONE[2]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


for f in sorted(glob.glob(os.path.join(src, "dog-*.png"))):
    name = os.path.basename(f)[4:-4]
    im = tone(Image.open(f).convert("RGBA"))
    im.save(os.path.join(out, f"dog-{name}.webp"), "WEBP", quality=90, method=6)
    if name not in FX:
        continue
    arr = np.asarray(im).copy()
    lab, comps = components(arr[..., 3])
    x0, y0, x1, y1 = FX[name]
    fx_ids = [c for c, cx, cy, n in comps if x0 <= cx <= x1 and y0 <= cy <= y1 and n < 6000]
    # 희미한 가장자리(알파 8 이하)는 가장 가까운 쪽에 붙이지 않고 몸통 쪽에 남긴다
    fx_mask = np.isin(lab, fx_ids)
    fx_mask = np.array(Image.fromarray(fx_mask.astype(np.uint8) * 255).filter(__import__("PIL.ImageFilter", fromlist=["MaxFilter"]).MaxFilter(3))) > 0
    fx_mask &= np.zeros_like(fx_mask) | True
    box = np.zeros_like(fx_mask)
    box[y0:y1, x0:x1] = True
    fx_mask &= box
    body = arr.copy()
    body[fx_mask, 3] = 0
    fx = arr.copy()
    fx[~fx_mask, 3] = 0
    Image.fromarray(body).save(os.path.join(out, f"dog-{name}-body.webp"), "WEBP", quality=90, method=6)
    Image.fromarray(fx).save(os.path.join(out, f"dog-{name}-fx.webp"), "WEBP", quality=90, method=6)
    print(name, "fx components:", len(fx_ids))

for f in sorted(glob.glob(os.path.join(out, "*.webp"))):
    print(os.path.basename(f), os.path.getsize(f) // 1024, "KB")
