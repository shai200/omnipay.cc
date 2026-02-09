#!/bin/bash
set -e

PROJECT_ID="omnipaycc-9e9cb"
SERVICE_NAME="omnipay"
REGION="us-central1"

echo "📦 Building and deploying to Cloud Run via Firebase..."

# Deploy using Cloud Build (managed by Firebase)
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project=$PROJECT_ID

echo "✅ Deployment complete!"
echo "Service: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
