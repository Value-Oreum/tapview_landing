"""탭뷰 파비콘·앱 아이콘: 로고의 'T'(윗줄 있는 T)를 딥그린 바탕에 흰색으로."""
import sys
import numpy as np
from PIL import Image, ImageDraw

repo, sp = sys.argv[1], sys.argv[2]
im = Image.open(f'{repo}/public/brand/logo-tap.png').convert('RGBA')
a = np.array(im)
H, W = a.shape[:2]
import cv2
ink = (a[:, :, 3] > 8).astype(np.uint8)
yy, xx = np.mgrid[0:H, 0:W]
# 대략 T 영역만 남기고(줄기·세리프 x<285, 가로획·윗줄 y<236), 'a'에서 묻어온 작은 조각은
# 연결 성분 중 큰 두 개(T 몸통 + 윗줄)만 남겨 지운다
rough = ink & (((xx < 285) | ((yy < 236) & (xx < 372)))).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(rough, connectivity=8)
order = sorted(range(1, n), key=lambda i: -stats[i, cv2.CC_STAT_AREA])[:2]
keep = np.isin(lab, order)
a[~keep, 3] = 0
T = Image.fromarray(a)
T = T.crop(T.getbbox())

GREEN = (1, 63, 21, 255)

def make(size, radius_ratio=0.22, scale=0.64, full=False):
    S = size * 4
    canvas = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    bg = Image.new('RGBA', (S, S), GREEN)
    mask = Image.new('L', (S, S), 255 if full else 0)
    if not full:
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius_ratio), fill=255)
    canvas.paste(bg, (0, 0), mask)
    th = int(S * scale)
    tw = int(T.width * th / T.height)
    t = T.resize((tw, th), Image.LANCZOS)
    canvas.alpha_composite(t, ((S - tw) // 2 + int(S * 0.012), (S - th) // 2))
    return canvas.resize((size, size), Image.LANCZOS)

app = f'{repo}/src/app'
make(512).save(f'{app}/icon.png')                       # 브라우저 탭·검색 결과
make(180, full=True, scale=0.6).convert('RGB').save(f'{app}/apple-icon.png')  # iOS 홈 화면 (모서리는 iOS가 깎음)
make(256).save(f'{app}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
make(192).save(f'{repo}/public/icon-192.png')
make(512).save(f'{repo}/public/icon-512.png')
make(512, full=True, scale=0.5).save(f'{repo}/public/icon-maskable-512.png')  # 안드로이드: 가운데 안전영역
make(512).save(f'{sp}/icon_preview.png')
print('ok', T.size)
