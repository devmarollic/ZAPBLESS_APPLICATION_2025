#!/usr/bin/env bash
set -euo pipefail

# ----------------------------------------------
# Shared reusable script for CI/CD in mono repo
# ----------------------------------------------

# Constants
GITHUB_API="https://api.github.com"
GHCR="ghcr.io"
OWNER="MAROLLIC"                                    
REPO="ZAPBLESS_APPLICATION_2025"                    
GITHUB_TOKEN="${GITHUB_TOKEN:-}"                    # Must be passed via env or workflow secret
PERSONAL_ACCESS_TOKEN="${PERSONAL_ACCESS_TOKEN:-}"  # Must be passed via env or workflow secret

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "❌ GITHUB_TOKEN is required but not set."
  exit 1
fi

# Function: compute_image_suffix <APP_NAME>
compute_image_suffix() {
  local APP_NAME="$1"

  echo "🔍 Fetching tags for $APP_NAME from GHCR..."

  mapfile -t tags < <(
    curl -sSL -H "Authorization: Bearer $GITHUB_TOKEN" \
      "https://ghcr.io/v2/${OWNER}/${APP_NAME}/tags/list" |
    jq -r '.tags[]?' | grep "^.*-${APP_NAME}-[0-9]\+$" || true
  )

  IFS=$'\n' sorted_tags=( $(printf '%s\n' "${tags[@]}" | sort -Vr) )
  unset IFS

  if (( ${#sorted_tags[@]} )); then
    newest="${sorted_tags[0]}"
    tail="${newest##*-}"
    if [[ $tail =~ ^[0-9]+$ ]]; then
      IMAGE_SUFFIX=$((tail + 1))
    else
      IMAGE_SUFFIX=1
    fi
  else
    IMAGE_SUFFIX=1
  fi

  export IMAGE_SUFFIX
  echo "✅ Next IMAGE_SUFFIX for $APP_NAME: $IMAGE_SUFFIX"

  echo "🧹 Pruning tags for $APP_NAME to keep top 2 (manual deletion must be done via GitHub UI/API)"
}

# Function: trigger_deployment <APP_MAIN> <APP_NAME> <IMAGE_FULL> <APP_VERSION> <APP_TYPE> <MIN_REPLICAS> <MAX_REPLICAS> <STABLE_MINUTES>
trigger_deployment() {
  local APP_MAIN="$1"
  local APP_NAME="$2"
  local IMAGE_FULL="$3"
  local APP_VERSION="$4"
  local APP_TYPE="$5"
  local MIN_REPLICAS="$6"
  local MAX_REPLICAS="$7"
  local STABLE_MINUTES="$8"

  echo "🚀 Triggering deployment for $APP_NAME..."

  curl -X POST "$GITHUB_API/repos/$OWNER/$REPO/actions/workflows/deploy-main.yml/dispatches" \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -d "{
      \"ref\": \"main\",
      \"inputs\": {
        \"APP_MAIN\": \"$APP_MAIN\",
        \"APP_NAME\": \"$APP_NAME\",
        \"IMAGE_FULL\": \"$IMAGE_FULL\",
        \"APP_VERSION\": \"$APP_VERSION\",
        \"APP_TYPE\": \"$APP_TYPE\",
        \"MIN_REPLICAS\": \"$MIN_REPLICAS\",
        \"MAX_REPLICAS\": \"$MAX_REPLICAS\",
        \"STABLE_MINUTES\": \"$STABLE_MINUTES\"
      }
    }"

  echo "✅ Deployment trigger sent to workflow."
}
