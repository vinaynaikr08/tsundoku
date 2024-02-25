#!/usr/bin/env bash

# Pull any changes to Compose files
git pull

# Pull latest backend image
docker pull ghcr.io/purdue-cs307-tsundoku/tsundoku-backend:latest

# Reload changed images
docker compose up -d --remove-orphans