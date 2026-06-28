#!/usr/bin/env bash
# Preprocess OpenStreetMap data for OSRM (MLD pipeline), region: Moldova.
# Run once before starting the OSRM container. Re-run to refresh map data.
#
# Usage: ./osrm/prepare.sh
set -euo pipefail

REGION_URL="https://download.geofabrik.de/europe/moldova-latest.osm.pbf"
DATA_DIR="$(cd "$(dirname "$0")" && pwd)/data"
PBF="moldova-latest.osm.pbf"
BASE="moldova-latest"
OSRM_IMAGE="ghcr.io/project-osrm/osrm-backend:latest"

mkdir -p "$DATA_DIR"

if [ ! -f "$DATA_DIR/$PBF" ]; then
  echo "Downloading $REGION_URL ..."
  curl -L "$REGION_URL" -o "$DATA_DIR/$PBF"
fi

run() { docker run --rm -t -v "$DATA_DIR:/data" "$OSRM_IMAGE" "$@"; }

echo "extract..."   ; run osrm-extract -p /opt/car.lua "/data/$PBF"
echo "partition..." ; run osrm-partition "/data/$BASE.osrm"
echo "customize..." ; run osrm-customize "/data/$BASE.osrm"

echo "Done. Start routing with: docker compose up -d osrm"
