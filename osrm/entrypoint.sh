#!/usr/bin/env bash
# Self-preparing OSRM: on first boot download + build the Moldova routing graph,
# then serve it. Subsequent restarts reuse the prepared data in /data.
set -e
cd /data

PBF="moldova-latest.osm.pbf"
URL="https://download.geofabrik.de/europe/moldova-latest.osm.pbf"

if [ ! -f .ready ]; then
  [ -f "$PBF" ] || wget -O "$PBF" "$URL"
  osrm-extract -p /opt/car.lua "$PBF"
  osrm-partition moldova-latest.osrm
  osrm-customize moldova-latest.osrm
  touch .ready
fi

exec osrm-routed --algorithm mld --port 5000 moldova-latest.osrm
