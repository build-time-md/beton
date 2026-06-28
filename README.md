# Beton — planificare livrare

Hartă pentru o firmă de transport beton. Utilizatorul plasează **locația clientului**
(sau folosește locația sa) și, opțional, **poziția camionului**. Aplicația alege
**cea mai potrivită stație de beton** și desenează ruta:

- cu camion: minimizează timpul total **camion → stație → client**;
- fără camion: alege stația cea mai apropiată de client (beton proaspăt = timp limitat).

## Stack

- **Next.js 15** (App Router, full-stack) + TypeScript
- **Leaflet + OpenStreetMap** pentru hartă (`react-leaflet`)
- **OSRM** self-hosted pentru rutare (matrice de timpi + traseu)
- Docker / docker-compose — gata pentru **Coolify**

## Structură

```
src/
  app/
    page.tsx              # server component, injectează stațiile
    api/plan/route.ts     # POST /api/plan — calculează planul de livrare
  components/
    MapView.tsx           # UI + state (client-side)
    LeafletMap.tsx        # harta Leaflet (ssr: false)
  data/stations.ts        # lista stațiilor de beton (SEED — de verificat)
  lib/
    osrm.ts               # client OSRM (table + route)
    planner.ts            # alegerea stației + construirea rutei
    geo.ts, types.ts
osrm/prepare.sh           # preprocesează datele OSM (Moldova) pentru OSRM
docker-compose.yml        # app + osrm
Dockerfile                # imagine Next standalone
```

## Rulare locală

1. Pregătește o singură dată datele de rutare (descarcă ~necesită Docker):

   ```bash
   ./osrm/prepare.sh
   docker compose up -d osrm        # pornește OSRM pe :5000
   ```

2. Aplicația:

   ```bash
   npm install
   npm run dev                       # http://localhost:3000
   ```

   `.env.local` pointează deja `OSRM_URL=http://localhost:5000`.

Sau totul în Docker: `docker compose up --build`.

## Deploy pe Coolify (tot stack-ul)

Se deployează cu **Docker Compose** — întregul stack (app + OSRM) dintr-un fișier,
fără pași manuali. OSRM își descarcă și preprocesează singur harta Moldovei la
prima pornire, într-un **volum persistent** (`osrm_data`).

1. Creează în Coolify o resursă nouă → **Docker Compose**, din acest repo.
   Coolify folosește `docker-compose.yml` (build-uiește app-ul din `Dockerfile`).
2. Setează **domeniul** pe serviciul `app` (port `3000`).
3. (opțional) Variabile de mediu pe `app`:
   - `OSRM_URL` e deja `http://osrm:5000` (rețeaua internă) — nu trebuie schimbat.
   - Centrul hărții / tile-urile au valori implicite în cod. Dacă vrei să le
     schimbi, sunt `NEXT_PUBLIC_*` și se aplică la **build** (build args), nu la runtime.
4. Prima pornire: OSRM construiește graful (~1–2 min); app-ul pornește între timp,
   iar calculul rutei/prețului devine activ când OSRM e gata. Re-deploy-urile sunt
   instant (datele rămân în volum).

Notă: tile-urile CARTO/OSM publice au limite de utilizare — pentru trafic mare,
rulează un tile server propriu sau un provider plătit.

## API

`POST /api/plan`

```json
{ "client": { "lat": 47.01, "lng": 28.86 }, "truck": { "lat": 47.02, "lng": 28.80 } }
```

Răspuns: stația aleasă, segmentele rutei (distanță/durată) și geometria pentru hartă.

## De făcut în continuare

- [ ] Înlocuit `src/data/stations.ts` cu lista reală, verificată, de stații de beton
      din zona Chișinău (nume, coordonate exacte, adresă, telefon).
- [ ] (opțional) Flotă de camioane multiple + alegerea camionului optim.
- [ ] (opțional) Tile server propriu pentru producție.
