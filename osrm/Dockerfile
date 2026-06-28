# Standalone, self-preparing OSRM routing service (Moldova).
# Deploy as its own Coolify resource: Build Pack = Dockerfile, Base Directory = /osrm,
# add Persistent Storage mounted at /data.
FROM ghcr.io/project-osrm/osrm-backend:latest

# wget for the one-time OSM download.
RUN apt-get update \
  && apt-get install -y --no-install-recommends wget ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /data
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/entrypoint.sh"]
