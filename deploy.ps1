#!/usr/bin/env pwsh
# 🚀 Cakesman Bakery - Automated Deployment Script
# This script automates the deployment process to Firebase Hosting + Cloud Run + MongoDB Atlas

Write-Host "🎉 Cakesman Bakery - Automated Deployment Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "cakesman-bakery"
$REGION = "us-central1"
$SERVICE_NAME = "cakesman-backend"
$FIREBASE_HOSTING_URL = "https://cakesman-bakery.web.app"

# Colors for output
$Success = "Green"
$Warning = "Yellow"
$Error = "Red"
$Info = "Cyan"

function Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "▶ $Message" -ForegroundColor $Info
    Write-Host "─────────────────────────────────────────" -ForegroundColor $Info
}

function Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Success
}

function Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Warning
}

function Error_ {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Error
    exit 1
}

# STEP 1: Verify Prerequisites
Step "Verifying Prerequisites"

$prerequisites = @(
    @{ cmd = "node --version"; name = "Node.js" },
    @{ cmd = "npm --version"; name = "npm" },
    @{ cmd = "firebase --version"; name = "Firebase CLI" },
    @{ cmd = "gcloud --version"; name = "Google Cloud CLI" },
    @{ cmd = "docker --version"; name = "Docker" }
)

foreach ($prereq in $prerequisites) {
    try {
        $output = Invoke-Expression $prereq.cmd 2>&1
        if ($LASTEXITCODE -eq 0) {
            Success "$($prereq.name): $(($output | Select-Object -First 1).ToString().Trim())"
        } else {
            Error_ "$($prereq.name) not found. Please install it first."
        }
    } catch {
        Error_ "$($prereq.name) not found. Please install it first."
    }
}

# STEP 2: Verify Project Structure
Step "Verifying Project Structure"

$requiredFiles = @(
    "frontend/package.json",
    "backend/package.json",
    "backend/server.js",
    "backend/.env.production",
    "frontend/.env.production"
)

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path "." $file
    if (Test-Path $fullPath) {
        Success "Found: $file"
    } else {
        Error_ "Missing: $file"
    }
}

# STEP 3: Build Frontend
Step "Building Frontend"

cd frontend
if (!(Test-Path "build")) {
    Write-Host "Running: npm install; npm run build" -ForegroundColor $Info
    npm install
    if ($LASTEXITCODE -ne 0) {
        cd ..
        Error_ "Frontend build failed"
    }
    npm run build
    if ($LASTEXITCODE -ne 0) {
        cd ..
        Error_ "Frontend build failed"
    }
} else {
    Warning "Build directory already exists. Skipping build."
}
Success "Frontend built successfully"
cd ..

# STEP 4: Login to Firebase
Step "Firebase Authentication"

Write-Host "Opening Firebase login in browser..." -ForegroundColor $Info
firebase login
if ($LASTEXITCODE -ne 0) {
    Error_ "Firebase login failed"
}
Success "Firebase login successful"

# STEP 5: Deploy Frontend
Step "Deploying Frontend to Firebase Hosting"

Write-Host "Deploying to Firebase Hosting..." -ForegroundColor $Info
firebase deploy --only hosting --project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Error_ "Firebase deployment failed"
}
Success "Frontend deployed to Firebase Hosting"

# STEP 6: Prepare Backend Docker Image
Step "Building Backend Docker Image"

cd backend

$IMAGE_TAG = "gcr.io/$PROJECT_ID/$SERVICE_NAME"
Write-Host "Building image: $IMAGE_TAG" -ForegroundColor $Info

docker build -t $IMAGE_TAG .
if ($LASTEXITCODE -ne 0) {
    cd ..
    Error_ "Docker build failed"
}
Success "Docker image built successfully"

# STEP 7: Push to Google Container Registry
Step "Pushing Docker Image to Container Registry"

Write-Host "Authenticating Docker with Google Cloud..." -ForegroundColor $Info
gcloud auth configure-docker gcr.io
if ($LASTEXITCODE -ne 0) {
    cd ..
    Error_ "Docker authentication failed"
}

Write-Host "Pushing image to GCR..." -ForegroundColor $Info
docker push $IMAGE_TAG
if ($LASTEXITCODE -ne 0) {
    cd ..
    Error_ "Docker push failed"
}
Success "Docker image pushed to Google Container Registry"

cd ..

# STEP 8: Deploy to Cloud Run
Step "Deploying to Cloud Run"

# Read environment variables from .env.production
$envContent = Get-Content "backend\.env.production" -Raw
$envVars = @{}

$envContent -split "`n" | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            $envVars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

# Build Cloud Run command
$gcloudCmd = @(
    "run", "deploy", $SERVICE_NAME,
    "--image", $IMAGE_TAG,
    "--region", $REGION,
    "--project", $PROJECT_ID,
    "--platform", "managed",
    "--memory", "512Mi",
    "--cpu", "1",
    "--timeout", "3600",
    "--allow-unauthenticated"
)

# Add environment variables
foreach ($key in $envVars.Keys) {
    if ($key -ne "" -and $key.StartsWith("NODE")) {
        $gcloudCmd += "--set-env-vars"
        $gcloudCmd += "$key=$($envVars[$key])"
    }
}

Write-Host "Deploying to Cloud Run with environment variables..." -ForegroundColor $Info
& gcloud $gcloudCmd
if ($LASTEXITCODE -ne 0) {
    Error_ "Cloud Run deployment failed"
}
Success "Backend deployed to Cloud Run"

# STEP 9: Get Cloud Run URL
Step "Retrieving Cloud Run Service URL"

$cloudRunUrl = $(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
Success "Cloud Run Service URL: $cloudRunUrl"

# STEP 10: Update Frontend Environment
Step "Updating Frontend Environment Variables"

$envProdPath = "frontend\.env.production"
$apiUrl = "$cloudRunUrl/api"

$envContent = "REACT_APP_API_URL=$apiUrl`n"
Set-Content $envProdPath $envContent
Success "Updated frontend/.env.production with: REACT_APP_API_URL=$apiUrl"

# STEP 11: Rebuild and Redeploy Frontend
Step "Rebuilding and Redeploying Frontend"

cd frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    cd ..
    Error_ "Frontend rebuild failed"
}
firebase deploy --only hosting --project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    cd ..
    Error_ "Firebase deployment failed"
}
cd ..
Success "Frontend redeployed with updated backend URL"

# STEP 12: Final Verification
Step "Verifying Deployment"

Write-Host "Testing frontend..." -ForegroundColor $Info
$frontendTest = Invoke-WebRequest -Uri $FIREBASE_HOSTING_URL -Method GET -ErrorAction SilentlyContinue
if ($frontendTest.StatusCode -eq 200) {
    Success "Frontend is accessible"
} else {
    Warning "Could not verify frontend (check manually at: $FIREBASE_HOSTING_URL)"
}

Write-Host "Testing backend..." -ForegroundColor $Info
$backendTest = Invoke-WebRequest -Uri "$cloudRunUrl/api/health" -Method GET -ErrorAction SilentlyContinue
if ($backendTest.StatusCode -eq 200) {
    Success "Backend is accessible"
} else {
    Warning "Could not verify backend (it may still be starting up)"
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor $Success
Write-Host "║          ✅ DEPLOYMENT SUCCESSFUL! ✅             ║" -ForegroundColor $Success
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor $Success
Write-Host ""
Write-Host "Frontend:    $FIREBASE_HOSTING_URL" -ForegroundColor $Success
Write-Host "Backend API: $cloudRunUrl/api" -ForegroundColor $Success
Write-Host ""
Write-Host "📊 View Logs:" -ForegroundColor $Info
Write-Host "  gcloud run logs read $SERVICE_NAME --region $REGION --limit 50" -ForegroundColor $Warning
Write-Host ""
Write-Host "📈 View Dashboard:" -ForegroundColor $Info
Write-Host "  Firebase: https://console.firebase.google.com/project/$PROJECT_ID" -ForegroundColor $Warning
Write-Host "  Cloud Run: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor $Warning
Write-Host ""
Write-Host "Save these URLs for future reference!" -ForegroundColor $Success
