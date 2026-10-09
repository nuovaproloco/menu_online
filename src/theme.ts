// Aspetto del sito (font, colori, sfondo) letto da src/data/theme.json, modificabile da Decap.
// I valori arrivano dal CMS: vengono validati qui e, se non validi, si torna ai predefiniti.
import theme from './data/theme.json';

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// Font Google disponibili. Tenere allineato con le opzioni in public/admin/config.yml.
// Tutti hanno i pesi 400-600; `italic` indica se esiste il corsivo vero (altrimenti il titolo resta dritto).
const FONTS: Record<string, { fallback: string; italic: boolean }> = {
  'Playfair Display': { fallback: SERIF, italic: true },
  'Cormorant Garamond': { fallback: SERIF, italic: true },
  'EB Garamond': { fallback: SERIF, italic: true },
  Lora: { fallback: SERIF, italic: true },
  Fraunces: { fallback: SERIF, italic: true },
  'Crimson Pro': { fallback: SERIF, italic: true },
  Cinzel: { fallback: SERIF, italic: false },
  Montserrat: { fallback: SANS, italic: true },
  Raleway: { fallback: SANS, italic: true },
  'Josefin Sans': { fallback: SANS, italic: true },
  Poppins: { fallback: SANS, italic: true },
  Nunito: { fallback: SANS, italic: true },
  Oswald: { fallback: SANS, italic: false },
  'Dancing Script': { fallback: 'cursive', italic: false },
};

const DEFAULTS = {
  title: 'Playfair Display',
  background: '#2b0518',
  surface: '#4a0a2c',
  text: '#f3e9d8',
  accent: '#d8b06a',
};

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const color = (v: unknown, d: string) => (typeof v === 'string' && HEX.test(v.trim()) ? v.trim() : d);
const font = (v: unknown) => (typeof v === 'string' && v in FONTS ? v : null);

function isLight(hex: string) {
  const h = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, '$&$&') : hex;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5;
}

const t = theme as any;
const titleFont = font(t.fonts?.title) ?? DEFAULTS.title;
const bodyFont = font(t.fonts?.body); // null (es. "Sistema") = font di sistema
const titleItalic = t.fonts?.title_italic !== false && FONTS[titleFont].italic;

const bg = color(t.colors?.background, DEFAULTS.background);
const surface = color(t.colors?.surface, DEFAULTS.surface);
const text = color(t.colors?.text, DEFAULTS.text);
const accent = color(t.colors?.accent, DEFAULTS.accent);

// ---------- Google Fonts ----------

const families = new Map<string, { up: Set<number>; it: Set<number> }>();
function need(name: string, up: number[], it: number[]) {
  const f = families.get(name) ?? { up: new Set<number>(), it: new Set<number>() };
  up.forEach((w) => f.up.add(w));
  if (FONTS[name].italic) it.forEach((w) => f.it.add(w));
  families.set(name, f);
}
need(titleFont, [500, 600], titleItalic ? [500] : []);
if (bodyFont) need(bodyFont, [400, 600], []);

const sorted = (s: Set<number>) => [...s].sort((a, b) => a - b);
export const fontsHref =
  'https://fonts.googleapis.com/css2?' +
  [...families]
    .map(([name, { up, it }]) => {
      const spec = it.size
        ? 'ital,wght@' + [...sorted(up).map((w) => `0,${w}`), ...sorted(it).map((w) => `1,${w}`)].join(';')
        : 'wght@' + sorted(up).join(';');
      return `family=${name.replace(/ /g, '+')}:${spec}`;
    })
    .join('&') +
  '&display=swap';

// ---------- sfondo ----------

function backgroundLayer(base: string) {
  const b = t.background ?? {};
  if (b.type === 'tinta') return 'none';
  if (b.type === 'immagine' && typeof b.image === 'string' && b.image.trim()) {
    const src = `${base}/${b.image.trim().replace(/^\/+/, '')}`.replace(/["\\\n\r]/g, '');
    const veil = Math.min(95, Math.max(0, Number(b.veil) || 0));
    const v = `color-mix(in srgb, var(--bg) ${veil}%, transparent)`;
    return `linear-gradient(${v}, ${v}), url("${src}") center / cover no-repeat`;
  }
  // Sfumatura (predefinito).
  return (
    'radial-gradient(120% 60% at 50% 0%, var(--surface) 0%, transparent 70%), ' +
    'radial-gradient(80% 50% at 50% 100%, var(--bg-deep) 0%, transparent 80%)'
  );
}

export const themeColor = bg;

export function themeCss(base: string) {
  const q = (name: string) => `'${name}'`;
  return `:root {
  color-scheme: ${isLight(bg) ? 'light' : 'dark'};
  --bg: ${bg};
  --surface: ${surface};
  --text: ${text};
  --accent: ${accent};
  --serif: ${q(titleFont)}, ${FONTS[titleFont].fallback};
  --sans: ${bodyFont ? `${q(bodyFont)}, ${FONTS[bodyFont].fallback}` : SANS};
  --title-style: ${titleItalic ? 'italic' : 'normal'};
  --bg-layer: ${backgroundLayer(base)};
}`;
}
