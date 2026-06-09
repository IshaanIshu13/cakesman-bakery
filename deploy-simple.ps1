#!/usr/bin/env pwsh
# Simplified Deployment Script for Cakesman Bakery

Write-Host "Starting Deployment..." -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Cyan
cd frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}
cd ..
Write-Host "Frontend built successfully!" -ForegroundColor Green

# Step 2: Deploy to Firebase
Write-Host "Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "Firebase deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Firebase deployment complete!" -ForegroundColor Green

# Step 3: Build Docker Image
Write-Host "Building Docker image..." -ForegroundColor Cyan
cd backend
$IMAGE = "gcr.io/cakesman-bakery-bcde6/cakesman-backend"
docker build -t $IMAGE .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..
Write-Host "Docker image built!" -ForegroundColor Green

# Step 4: Push Docker Image
Write-Host "Pushing Docker image to Google Container Registry..." -ForegroundColor Cyan
gcloud auth configure-docker gcr.io
docker push $IMAGE
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Docker image pushed successfully!" -ForegroundColor Green

# Step 5: Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy cakesman-backend `
  --image $IMAGE `
  --region us-central1 `
  --platform managed `
  --memory 512Mi `
  --allow-unauthenticated `
  --set-env-vars "NODE_ENV=production,PORT=5001,MONGO_URI=mongodb+srv://gandhiishaan132_db_user:GbIf1q2ZOjZmthTp@cluster7.vffrnqy.mongodb.net/cakesman?retryWrites=true&w=majority,JWT_SECRET=ishaan_secret_key_12345_abcdefgh_98765432,FRONTEND_URL=https://cakesman-bakery-bcde6.web.app,CORS_ORIGIN=https://cakesman-bakery-bcde6.web.app"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Cloud Run deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Cloud Run deployment complete!" -ForegroundColor Green

# Step 6: Get Cloud Run URL
Write-Host "Getting Cloud Run service URL..." -ForegroundColor Cyan
$CLOUD_RUN_URL = $(gcloud run services describe cakesman-backend --region us-central1 --format='value(status.url)')

# Step 7: Update Frontend Environment
Write-Host "Updating frontend environment..." -ForegroundColor Cyan
$API_URL = "$CLOUD_RUN_URL/api"
Set-Content frontend\.env.production "REACT_APP_API_URL=$API_URL`n"

# Step 8: Rebuild and Redeploy Frontend
Write-Host "Rebuilding frontend with Cloud Run URL..." -ForegroundColor Cyan
cd frontend
npm run build
cd ..

Write-Host "Redeploying frontend..." -ForegroundColor Cyan
firebase deploy --only hosting

Write-Host "" -ForegroundColor Green
Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:    https://cakesman-bakery-bcde6.web.app" -ForegroundColor Green
Write-Host "Backend API: $($CLOUD_RUN_URL)/api" -ForegroundColor Green
Write-Host ""
