"""생성한 폰 사진(화면 = 크로마 초록)을 히어로용 소재로 만든다.

- 초록 화면을 투명하게 뚫어 HTML 화면이 뒤에서 비치게 한다 (펀치홀 카메라는 남김)
- 화면 가장자리와 바닥에 번진 초록빛을 지운다
- 화면 위치(이미지 대비 %)를 phone.json으로 저장한다

사용: python -I scripts/prep-phone.py <입력.jpg> <출력 폴더>
"""
import json
import sys

import numpy as np
from PIL import Image

src, out_dir = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
H, W, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]
rb = np.maximum(r, b)
green = g - rb

# 1) 화면 영역: 강한 초록
core = (green > 70) & (g > 110)
rows = np.where(core.sum(axis=1) > W * 0.05)[0]
cols = np.where(core.sum(axis=0) > H * 0.05)[0]
y0, y1, x0, x1 = rows.min(), rows.max(), cols.min(), cols.max()
pad = 6
box = np.zeros((H, W), bool)
box[y0 - pad:y1 + pad + 1, x0 - pad:x1 + pad + 1] = True

# 2) 알파: 화면 박스 안에서 초록 정도에 따라 투명
alpha = np.ones((H, W), np.float32)
t = np.clip((green - 18) / (70 - 18), 0, 1)
alpha[box] = 1 - t[box]

# 3) 초록 번짐 제거: 바탕 톤(약간 초록)은 남기고 넘치는 초록만 깎는다
bg = im[20:120, 20:120].reshape(-1, 3).mean(axis=0)
bg_lift = float(bg[1] - max(bg[0], bg[2]))
limit = rb + max(bg_lift, 4) + 2
g2 = np.where(g > limit, limit, g)
# 반투명 가장자리는 초록을 완전히 뺀다
g2 = np.where(box & (alpha < 0.98), np.minimum(g2, rb + 2), g2)
im[..., 1] = g2

rgba = np.dstack([np.clip(im, 0, 255), alpha * 255]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(f"{out_dir}/phone.webp", "WEBP", quality=88, method=6)

# 화면 모서리 반경 추정: 맨 윗줄에서 초록이 시작하는 x
top_row = np.where(core[y0 + 1])[0]
radius = int(top_row.min() - x0) if top_row.size else 0
meta = {
    "imageW": W, "imageH": H,
    "screen": {"left": x0 / W * 100, "top": y0 / H * 100, "width": (x1 - x0 + 1) / W * 100, "height": (y1 - y0 + 1) / H * 100},
    "screenPx": [int(x0), int(y0), int(x1), int(y1)],
    "radiusPx": radius,
    "bg": [round(float(c)) for c in bg],
}
json.dump(meta, open(f"{out_dir}/phone.json", "w"), indent=1)
print(meta)
