"""사이트 이미지 가볍게: 강아지 움직이는 WebP 다시 압축, 작게 쓰는 강아지 그림 축소, 로고 PNG → WebP.
실행: python -I scripts/optimize-images.py  (리포 루트에서)"""
import os
from PIL import Image, ImageSequence

def anim(path, size, q=40, alpha_q=60):
    im = Image.open(path)
    frames, durs = [], []
    for f in ImageSequence.Iterator(im):
        durs.append(f.info.get('duration', 66))
        fr = f.convert('RGBA')
        if fr.size[0] > size:
            fr = fr.resize((size, size), Image.LANCZOS)
        frames.append(fr)
    before = os.path.getsize(path)
    tmp = path + '.tmp.webp'
    frames[0].save(tmp, save_all=True, append_images=frames[1:], duration=durs, loop=0,
                   quality=q, alpha_quality=alpha_q, method=6, minimize_size=True, kmax=60)
    os.replace(tmp, path)
    print(f'{path}: {before//1024} → {os.path.getsize(path)//1024} KB')

def still(path, size, q=80):
    im = Image.open(path).convert('RGBA')
    before = os.path.getsize(path)
    if im.size[0] > size:
        im = im.resize((size, size), Image.LANCZOS)
    im.save(path, quality=q, method=6)
    print(f'{path}: {before//1024} → {os.path.getsize(path)//1024} KB')

def logo(src, dst, height=None, width=None, q=90):
    im = Image.open(src).convert('RGBA')
    if height:
        im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    if width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dst, quality=q, method=6)
    print(f'{dst}: {im.size} {os.path.getsize(dst)//1024} KB')

# 히어로 강아지 영상(화면에 최대 약 430px) — 400px
for n in ['wake', 'wave-loop']:
    anim(f'public/dog/anim/{n}.webp', 400)
# 작은 강아지 영상(최대 176px) — 320px
for n in ['run-loop', 'cheer-loop', 'sleep-loop', 'headspin']:
    anim(f'public/dog/anim/{n}.webp', 320)
# 히어로에 크게 쓰는 dog-sleep·dog-wave는 그대로, 나머지는 320px
for f in sorted(os.listdir('public/dog')):
    if f.endswith('.webp') and f not in ('dog-sleep.webp', 'dog-wave.webp'):
        still(f'public/dog/{f}', 320)
logo('public/brand/logo-tap.png', 'public/brand/logo-tap.webp', height=320)
logo('public/brand/logo-view.png', 'public/brand/logo-view.webp', height=320)
logo('public/brand/logo-white.png', 'public/brand/logo-white.webp', width=400)
