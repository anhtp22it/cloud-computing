#!/bin/bash
set -e

docker buildx build --platform linux/amd64 -t tanh11704/event-management-frontend:1.0 --push .