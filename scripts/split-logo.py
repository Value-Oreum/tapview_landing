"""TapView 로고를 'Tap'과 'View' 두 장으로 나눈다 (히어로 알약 창 연출용).

원본 로고의 알파 채널에서 연결 요소를 찾고, 모션그래픽 작업 때 만든 조각 정보
(logo_parts.json: T, Tbar, a, p, V, i_stem, i_dot, e, w)에 맞춰 글자를 묶는다.
결과는 흰색(#F2F4EF) 글자 PNG 두 장이며, 두 장 모두 원본과 같은 높이라 기준선이 맞는다.

사용: python -I scripts/split-logo.py <logo_green.png> <logo_parts.json> <출력 폴더>
"""
import json
import sys
from collections import deque

from PIL import Image

src_png, parts_json, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
TAP = {"T", "Tbar", "a", "p"}
INK = (242, 244, 239)

im = Image.open(src_png).convert("RGBA")
W, H = im.size
alpha = im.getchannel("A")
A = alpha.load()
parts = json.load(open(parts_json, encoding="utf-8"))["parts"]

label = [[0] * W for _ in range(H)]
comps = []  # (sumx, sumy, n, minx, maxx)
cur = 0
for y in range(H):
    for x in range(W):
        if A[x, y] == 0 or label[y][x]:
            continue
        cur += 1
        q = deque([(x, y)])
        label[y][x] = cur
        sx = sy = n = 0
        mnx, mxx = x, x
        while q:
            cx, cy = q.popleft()
            sx += cx; sy += cy; n += 1
            mnx = min(mnx, cx); mxx = max(mxx, cx)
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < W and 0 <= ny < H and A[nx, ny] and not label[ny][nx]:
                        label[ny][nx] = cur
                        q.append((nx, ny))
        comps.append((sx / n, sy / n, n, mnx, mxx))


def part_of(cx, cy):
    best, area = None, None
    for p in parts:
        if p["x"] <= cx <= p["x"] + p["w"] and p["y"] <= cy <= p["y"] + p["h"]:
            a = p["w"] * p["h"]
            if area is None or a < area:
                best, area = p["name"], a
    if best is None:  # 작은 조각: 가장 가까운 조각 중심으로
        best = min(parts, key=lambda p: (p["x"] + p["w"] / 2 - cx) ** 2 + (p["y"] + p["h"] / 2 - cy) ** 2)["name"]
    return best


group = {}
big = 0
for i, (cx, cy, n, mnx, mxx) in enumerate(comps, start=1):
    name = part_of(cx, cy)
    group[i] = "tap" if name in TAP else "view"
    if n > 500:
        big += 1
print(f"components: {len(comps)} (big: {big})")

tap = Image.new("RGBA", (W, H), (0, 0, 0, 0))
view = Image.new("RGBA", (W, H), (0, 0, 0, 0))
T, V = tap.load(), view.load()
tap_max, view_min = 0, W
for y in range(H):
    row = label[y]
    for x in range(W):
        l = row[x]
        if not l:
            continue
        a = A[x, y]
        if group[l] == "tap":
            T[x, y] = (*INK, a); tap_max = max(tap_max, x)
        else:
            V[x, y] = (*INK, a); view_min = min(view_min, x)

tap = tap.crop((0, 0, tap_max + 1, H))
view = view.crop((view_min, 0, W, H))
tap.save(f"{out_dir}/logo-tap.png", optimize=True)
view.save(f"{out_dir}/logo-view.png", optimize=True)
meta = {"height": H, "tapWidth": tap.size[0], "viewWidth": view.size[0], "overlap": tap_max + 1 - view_min}
json.dump(meta, open(f"{out_dir}/logo-split.json", "w"), indent=1)
print(meta)
