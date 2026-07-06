# Beton — livrare beton Chișinău (DARSAN)

Site multilingv (ro / ru / en) pentru o firmă de livrare beton, cu **calculator de
preț pe hartă** și **18 pagini de district** pentru SEO local. Utilizatorul plasează
**locația clientului** (sau folosește locația sa) și, opțional, **poziția camionului**.
Aplicația alege **mereu stația cea mai apropiată de client** (după drumul **încărcat**
stație → client, fiindcă betonul proaspăt are timp de lucru limitat) și desenează ruta:

- fără camion: ruta stație → client;
- cu camion: ruta camion → stație (gol) → client. Camionul ajunge gol la stație,
  deci poziția lui doar desenează traseul — **nu** schimbă stația aleasă.

## Stack

- **Next.js 15** (App Router, full-stack) + TypeScript
- **Leaflet + OpenStreetMap** pentru hartă (`react-leaflet`)
- **OSRM** self-hosted pentru rutare (matrice de timpi + traseu)
- Docker / docker-compose — gata pentru **Coolify**

## Structură

```
src/
  app/
    (ro)/                    # rutele românești (grup — nu apare în URL)
      page.tsx               #   / — pagina principală ro
      livrare-beton/[oras]/  #   paginile de district ro
    ru/                      # /ru + /ru/dostavka-betona/[oras]
    en/                      # /en + /en/concrete-delivery/[oras]
    api/plan/route.ts        # POST /api/plan — planul de livrare (OSRM)
    sitemap.ts, robots.ts    # SEO: sitemap (57 URL-uri) + robots
    not-found.tsx            # 404 trilingv
  components/
    MapView.tsx              # calculatorul de preț (client-side)
    LeafletMap.tsx           # harta Leaflet (ssr: false)
    DistrictPage.tsx         # șablonul paginilor de district
    LocaleChrome.tsx         # <html lang> + JSON-LD LocalBusiness per limbă
    WhatsAppFloat.tsx        # butonul plutitor de WhatsApp
  data/
    districts/               # 18 fișiere de district (conținut unic ro/ru/en)
    stations.ts              # stațiile de beton (SEED — de verificat)
  lib/
    seo.ts                   # metadata, canonical, hreflang, LocalBusiness
    structured-data.ts       # JSON-LD Service + FAQPage per district
    estimate.ts              # estimarea {km}/{price} la build (fără OSRM)
    planner.ts, pricing.ts   # alegerea stației + calculul prețului (live)
docker-compose.yml           # stack-ul de PRODUCȚIE (Coolify): app + osrm
docker-compose.dev.yml       # dev local (next dev, hot reload) — doar cu -f
Dockerfile                   # multi-stage: deps / dev / builder / runner
```

## Dezvoltare locală (Docker, recomandat)

Nu ai nevoie de Node instalat local — totul rulează în containere:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

- App (next dev, hot reload): **http://localhost:3001**
- OSRM: http://localhost:5000 (își descarcă + preprocesează singur harta Moldovei
  la prima pornire, în volumul persistent `osrm_data`)

Fișierul `docker-compose.dev.yml` NU se aplică automat (intenționat): un
`docker compose up` simplu pornește stack-ul de producție, nu dev-ul.

Alternativ, cu Node local: `npm install && npm run dev` (+ `docker compose up -d osrm`
pentru rutare; `.env.local` cu `OSRM_URL=http://localhost:5000`).

## Deploy pe Coolify (tot stack-ul)

Se deployează cu **Docker Compose** — întregul stack (app + OSRM) dintr-un fișier,
fără pași manuali. OSRM își descarcă și preprocesează singur harta Moldovei la
prima pornire, într-un **volum persistent** (`osrm_data`).

1. Creează în Coolify o resursă nouă → **Docker Compose**, din acest repo.
   Coolify folosește `docker-compose.yml` (build-uiește app-ul din `Dockerfile`).
2. **OBLIGATORIU:** setează `NEXT_PUBLIC_SITE_URL=https://domeniul-tau.md` ca
   **Build Variable** (nu doar runtime!). Valoarea se copt în build — alimentează
   canonical, hreflang, sitemap și JSON-LD. Fără ea, site-ul se lansează cu
   domeniul placeholder `beton.build-time.net` în toate URL-urile SEO.
3. Setează **domeniul** pe serviciul `app` (port `3000`).
4. Prima pornire: OSRM construiește graful (~1–2 min); app-ul pornește între timp,
   iar calculul rutei/prețului devine activ când OSRM e gata. Re-deploy-urile sunt
   instant (datele rămân în volum).
5. **Verificare după primul deploy:**

   ```bash
   curl -s https://domeniul-tau.md/ | grep canonical    # domeniul real, nu build-time.net
   curl -s https://domeniul-tau.md/robots.txt           # sitemap pe domeniul real
   ```

Note:
- `OSRM_URL` e deja `http://osrm:5000` (rețeaua internă) — nu trebuie schimbat.
- Imaginea OSRM e **pinuită pe digest**; la un upgrade deliberat, schimbă și
  sufixul marker-ului `.ready-*` din compose ca graful să fie reconstruit.
- Tile-urile CARTO/OSM publice au limite de utilizare — pentru trafic mare,
  rulează un tile server propriu sau un provider plătit.

## API

`POST /api/plan`

```json
{ "client": { "lat": 47.01, "lng": 28.86 }, "truck": { "lat": 47.02, "lng": 28.80 } }
```

Răspuns: stația aleasă, segmentele rutei (distanță/durată) și geometria pentru hartă.

## De făcut înainte / imediat după lansare

- [ ] **Datele firmei** în `src/lib/contact.ts` (adresă, cod poștal, coordonate sediu,
      denumire juridică) — fără ele, schema LocalBusiness nu are address/geo și
      site-ul nu e eligibil pentru rezultatele locale Google.
- [ ] **`NEXT_PUBLIC_SITE_URL`** ca Build Variable în Coolify (vezi Deploy, pasul 2).
- [ ] Înlocuit `src/data/stations.ts` cu lista reală, verificată, de stații de beton
      (coordonatele alimentează estimările {km}/{price} de pe paginile de district).
- [ ] (opțional) Google Business Profile + `sameAs` în schema LocalBusiness.
- [ ] (opțional) Flotă de camioane multiple + alegerea camionului optim.
- [ ] (opțional) Tile server propriu pentru producție.
