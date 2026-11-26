"""Paperlogy(SIL OFL 1.1) 웹 서브셋 만들기.

KS X 1001 완성형 한글 2,350자 + ASCII + 자주 쓰는 기호만 남겨 woff2로 저장한다.
폼에 사람이 입력하는 글자도 대부분 이 범위에 들어간다. 범위 밖 글자는 시스템 글꼴로 대체된다.

사용: python scripts/subset-fonts.py [글꼴 폴더]
기본 글꼴 폴더는 %LOCALAPPDATA%/Microsoft/Windows/Fonts (Paperlogy-*.ttf 설치 위치)
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

FONT_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    os.environ.get("LOCALAPPDATA", ""), "Microsoft", "Windows", "Fonts"
)
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "app", "fonts")
WEIGHTS = [(300, "3Light"), (400, "4Regular"), (600, "6SemiBold"), (800, "8ExtraBold")]


def ksx1001_hangul():
    chars = []
    for lead in range(0xB0, 0xC9):
        for trail in range(0xA1, 0xFF):
            try:
                chars.append(bytes([lead, trail]).decode("euc-kr"))
            except UnicodeDecodeError:
                pass
    return chars


def charset():
    chars = set(ksx1001_hangul())
    chars |= set(map(chr, range(0x20, 0x7F)))
    chars |= set("ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ")
    chars |= set("₩·×÷—–‘’“”…①②③④⑤⑥⑦⑧⑨›‹«»●○◎◆◇■□▲△▶▷▼▽✓✔→←↓↑↗※★☆♥%°±")
    chars |= set(" 「」『』〈〉《》【】、。")
    return chars


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    unicodes = sorted(ord(c) for c in charset())
    for weight, name in WEIGHTS:
        src = os.path.join(FONT_DIR, f"Paperlogy-{name}.ttf")
        font = TTFont(src)
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "pnum"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=unicodes)
        sub.subset(font)
        out = os.path.join(OUT_DIR, f"Paperlogy-{weight}.woff2")
        font.flavor = "woff2"
        font.save(out)
        print(f"{out}  {os.path.getsize(out) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
