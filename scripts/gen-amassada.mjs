// Gera public/tex/amassada.svg: folha amassada e alisada.
// Cada vinco é uma reta; o papel de um lado dele fica mais escuro (ou mais claro)
// com mudança dura de tom bem no vinco e falloff suave para longe dele.
// A soma desses meios-planos forma as faces, delimitadas pelos vincos.
// Vincos secundários curtos saem dos principais. Mais o anel de café.
import { writeFileSync } from "node:fs";
const [, , out] = process.argv;
const W = 720, H = 1100;
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const f = (v) => v.toFixed(1);
let gid = 0;
const defs = [];
let body = "";

function edgePoint() {
  const e = Math.floor(rnd() * 4), t = 0.05 + rnd() * 0.9;
  return e === 0 ? [t * W, 0] : e === 1 ? [W, t * H] : e === 2 ? [t * W, H] : [0, t * H];
}
/** sombreia o lado "n" de um segmento: polígono do vinco até `reach` px, gradiente duro→suave */
function face(a, b, n, reach, color, op, taper = false) {
  const id = "g" + gid++;
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(m[0])}" y1="${f(m[1])}" x2="${f(m[0] + n[0] * reach)}" y2="${f(m[1] + n[1] * reach)}"><stop offset="0" stop-color="${color}" stop-opacity="${op.toFixed(3)}"/><stop offset=".35" stop-color="${color}" stop-opacity="${(op * 0.45).toFixed(3)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`);
  // vinco curto: a face afina até a ponta (b) e some ao longo do comprimento
  const tipReach = taper ? reach * 0.08 : reach;
  let mask = "";
  if (taper) {
    const mid = "m" + id;
    defs.push(`<linearGradient id="l${mid}" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#l${mid})"/></mask>`);
    mask = ` mask="url(#${mid})"`;
  }
  body += `<path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}L${f(b[0] + n[0] * tipReach)} ${f(b[1] + n[1] * tipReach)}L${f(a[0] + n[0] * reach)} ${f(a[1] + n[1] * reach)}Z" fill="url(#${id})" filter="url(#soft)"${mask}/>`;
}
function crease(a, b, strength, reach, taper = false) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const n = [-dy / L, dx / L];
  const side = rnd() < 0.5 ? 1 : -1;
  const nn = [n[0] * side, n[1] * side];
  // lado da sombra e lado da luz: mudança dura no vinco
  face(a, b, nn, reach, "rgb(92 70 38)", 0.11 * strength, taper);
  face(a, b, [-nn[0], -nn[1]], reach * 0.6, "#ffffff", 0.22 * strength, taper);
  // o vinco em si: fio escuro + fio de luz deslocado (os curtos também somem na ponta)
  const d = `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`;
  let m = "";
  if (taper) {
    const id = "s" + gid++;
    defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="k${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#${id})"/></mask>`);
    m = ` mask="url(#k${id})"`;
  }
  body += `<g${m}><path d="${d}" stroke="rgb(78 58 32)" stroke-width="1.6" opacity="${(0.3 * strength).toFixed(2)}" filter="url(#b1)"/>`;
  body += `<path d="${d}" stroke="#fff" stroke-width="2" opacity="${(0.55 * strength).toFixed(2)}" transform="translate(${f(-nn[0] * 2.2)} ${f(-nn[1] * 2.2)})" filter="url(#b1)"/></g>`;
}

seed = 23;
const primaries = [];
while (primaries.length < 7) {
  const a = edgePoint(), b = edgePoint();
  if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 520) continue;
  primaries.push([a, b]);
}
for (const [a, b] of primaries) crease(a, b, 1, 150 + rnd() * 120);
// secundários: saem de um ponto do principal, curtos, em ângulo
for (const [a, b] of primaries) {
  const k = 1 + Math.floor(rnd() * 2);
  for (let i = 0; i < k; i++) {
    const t = 0.2 + rnd() * 0.6;
    const p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + (rnd() < 0.5 ? 1 : -1) * (0.5 + rnd() * 0.7);
    const len = 90 + rnd() * 140;
    crease(p, [p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len], 0.7, 50 + rnd() * 40, true);
  }
}

function blob(cx, cy, r, s, amp = 0.07, n = 120) {
  seed = s;
  const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + amp * (0.55 * Math.sin(2 * a + ph[0]) + 0.3 * Math.sin(5 * a + ph[1]) + 0.15 * Math.sin(9 * a + ph[2]));
    pts.push(`${f(cx + Math.cos(a) * r * k)} ${f(cy + Math.sin(a) * r * k)}`);
  }
  return "M" + pts.join("L") + "Z";
}
const cx = 540, cy = 790, r = 82, c = 2 * Math.PI * r;
const p1 = blob(cx, cy, r, 5), p2 = blob(cx + 18, cy - 12, r * 0.98, 9, 0.08);
const ring = `<path d="${p1}" fill="rgb(150 100 45)" opacity=".05"/>
<g filter="url(#ring)" fill="none" stroke="rgb(120 72 28)">
<path d="${p1}" stroke-width="5" opacity=".4" stroke-dasharray="${f(c * 0.62)} ${f(c * 0.08)} ${f(c * 0.22)} ${f(c * 0.08)}"/>
<path d="${p1}" stroke-width="14" opacity=".07"/>
<path d="${p2}" stroke-width="3" opacity=".2" stroke-dasharray="${f(c * 0.3)} ${f(c * 0.7)}" stroke-dashoffset="${f(c * 0.15)}"/>
</g>
<path d="${blob(cx + r * 0.9, cy + r * 0.75, 10, 14, 0.3)}" fill="rgb(120 72 28)" opacity=".3" filter="url(#b1)"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<!-- Gerado por scripts/gen-amassada.mjs (node scripts/gen-amassada.mjs public/tex/amassada.svg). Não editar à mão. -->
<defs>
<filter id="b1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.1"/></filter>
<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="ring" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="8"/><feDisplacementMap in="SourceGraphic" scale="12"/><feGaussianBlur stdDeviation="1.1"/></filter>
<radialGradient id="vg" cx="50%" cy="45%" r="75%"><stop offset=".55" stop-color="rgb(140 110 50)" stop-opacity="0"/><stop offset="1" stop-color="rgb(140 110 50)" stop-opacity=".26"/></radialGradient>
${defs.join("\n")}
</defs>
${body}
${ring}
<rect width="${W}" height="${H}" fill="url(#vg)"/>
</svg>`;
writeFileSync(out, svg);
console.log("bytes", svg.length);
