# Menu site (Astro + Decap + GitHub Pages)

Sito statico con un menù a più pagine (immagini), visibile solo da QR (noindex) e gestito da `/admin/`.

## URL
- `/m/<slug>/` menù pubblico (slug in `src/config.ts`, NON cambiarlo dopo la stampa del QR)
- `/qr/<slug>/` pagina con download del QR (SVG e PNG), non linkata da nessuna parte
- `/admin/` Decap CMS

## Setup
1. Crea il repo su GitHub e fai push su `main`.
2. Settings > Pages > Source: **GitHub Actions**.
3. In `astro.config.mjs` imposta `site` e `base` (dominio personalizzato consigliato: `base: '/'`).
4. In `src/config.ts` metti uno slug casuale:
   `node -e "console.log(require('crypto').randomBytes(5).toString('hex'))"`
5. Login Decap: crea una GitHub OAuth App e deploya un OAuth proxy (es. Cloudflare Worker, template
   `sterlingwes/decap-proxy` o `i40west/netlify-cms-cloudflare-pages`). Poi in `public/admin/config.yml`
   imposta `repo` e `base_url`. Callback URL OAuth App: `https://<worker>/callback`.
6. Apri `/qr/<slug>/`, scarica il QR e stampalo.

## Uso quotidiano
`/admin/` > Menù > Pagine del menù: aggiungi, riordina o sostituisci le immagini > Publish.
Dopo 1-2 minuti la Action ricostruisce il sito e il menù è aggiornato (il QR non cambia).

## Immagini
WebP o JPG, larghezza max ~1600px, sotto ~400 KB l'una: finiscono nella history di git.

## Sviluppo
npm install && npm run dev
