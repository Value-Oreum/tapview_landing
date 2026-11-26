/**
 * 로드맵 세계 지도(점 지도) 생성.
 *   public/world/dots.svg              — 바탕 점(육지 전체)
 *   src/components/sections/worldMap.ts — 한국·일본·유럽 점과 핀 좌표
 *
 * 리포에 의존성을 늘리지 않으려고 임시 폴더에서 돌린다.
 *   mkdir tmp-geo && cd tmp-geo && npm i world-atlas@2 topojson-client@3 d3-geo@3
 *   NODE_PATH=./node_modules node ../scripts/make-world-dots.cjs <리포 경로>
 */
const fs = require("fs");
const path = require("path");
const { feature } = require("topojson-client");
const d3 = require("d3-geo");

const repo = process.argv[2] || path.resolve(__dirname, "..");
const land110 = require("world-atlas/land-110m.json");
const countries50 = require("world-atlas/countries-50m.json");

const W = 1000;
const STEP = 6.4;
const land = feature(land110, land110.objects.land);
const countries = feature(countries50, countries50.objects.countries).features;

const proj = d3.geoNaturalEarth1().rotate([-10, 0]).fitWidth(W, { type: "Sphere" });

const EU = new Set(
  [
    250, 276, 724, 380, 826, 616, 528, 56, 756, 40, 203, 208, 752, 578, 246, 620, 372, 300, 348, 642, 100, 703, 705, 191,
    688, 70, 499, 8, 807, 440, 428, 233, 442, 498,
  ].map((n) => String(n).padStart(3, "0")),
);
const pick = (ids) => ({ type: "FeatureCollection", features: countries.filter((f) => ids.has(String(f.id))) });
const REGIONS = {
  kr: pick(new Set(["410"])),
  jp: pick(new Set(["392"])),
  eu: pick(EU),
};

const r1 = (n) => Math.round(n * 10) / 10;
const all = [];
const byRegion = { kr: [], jp: [], eu: [] };
let row = 0;
for (let y = STEP / 2; y < W * 0.55; y += STEP, row++) {
  const off = row % 2 ? STEP / 2 : 0; // 벌집 배열
  for (let x = STEP / 2 + off; x < W; x += STEP) {
    const ll = proj.invert([x, y]);
    if (!ll || ll[1] < -57 || ll[1] > 80) continue;
    if (!d3.geoContains(land, ll)) {
      // 작은 섬나라(한국·일본)는 110m 육지에 거의 안 잡히니 50m 국경으로 한 번 더
      let hit = null;
      for (const k of ["kr", "jp"]) if (d3.geoContains(REGIONS[k], ll)) hit = k;
      if (!hit) continue;
      byRegion[hit].push([r1(x), r1(y)]);
      all.push([r1(x), r1(y)]);
      continue;
    }
    all.push([r1(x), r1(y)]);
    for (const k of Object.keys(REGIONS)) {
      // 유럽은 본토만 (프랑스령 기아나 같은 해외 영토 제외)
      if (k === "eu" && (ll[0] < -12 || ll[0] > 40 || ll[1] < 34)) continue;
      if (d3.geoContains(REGIONS[k], ll)) byRegion[k].push([r1(x), r1(y)]);
    }
  }
}

const ys = all.map((p) => p[1]);
const top = Math.floor(Math.min(...ys) - 8);
const bottom = Math.ceil(Math.max(...ys) + 8);
const H = bottom - top;
const shift = (pts) => pts.map(([x, y]) => [x, r1(y - top)]);
const toPath = (pts) => shift(pts).map(([x, y]) => `M${x} ${y}h0`).join("");

const pin = (lon, lat) => {
  const [x, y] = proj([lon, lat]);
  return [r1(x), r1(y - top)];
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path d="${toPath(all)}" stroke="#f2f4ef" stroke-opacity=".2" stroke-width="2.9" stroke-linecap="round"/></svg>`;
fs.mkdirSync(path.join(repo, "public/world"), { recursive: true });
fs.writeFileSync(path.join(repo, "public/world/dots.svg"), svg);

const ts = `// scripts/make-world-dots.cjs 로 만든 파일. 직접 고치지 마세요.
export const MAP_W = ${W};
export const MAP_H = ${H};
export const REGION_DOTS = {
  kr: "${toPath(byRegion.kr)}",
  jp: "${toPath(byRegion.jp)}",
  eu: "${toPath(byRegion.eu)}",
} as const;
export const PINS = {
  kr: [${pin(127.3, 36.4)}],
  jp: [${pin(138.6, 36.2)}],
  eu: [${pin(9.5, 49.5)}],
} as const;
`;
fs.writeFileSync(path.join(repo, "src/components/sections/worldMap.ts"), ts);
console.log({ W, H, dots: all.length, kr: byRegion.kr.length, jp: byRegion.jp.length, eu: byRegion.eu.length, svgKB: (svg.length / 1024).toFixed(1) });
