# CrisisVision Demo UI - Quick Build Script (Windows)

Write-Host "🚀 Setting up CrisisVision Demo UI..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this from the demo-ui directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Build the project
Write-Host "🔨 Building production version..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Setup complete! You can now:" -ForegroundColor Green
Write-Host ""
Write-Host "  Run in development mode:" -ForegroundColor Yellow
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Run in production mode:" -ForegroundColor Yellow
Write-Host "    npm start" -ForegroundColor White
Write-Host ""
Write-Host "  Build Docker image:" -ForegroundColor Yellow
Write-Host "    docker build -t crisisvision-demo ." -ForegroundColor White
Write-Host ""
Write-Host "  Run with Docker:" -ForegroundColor Yellow
Write-Host "    docker run -p 3000:3000 crisisvision-demo" -ForegroundColor White
Write-Host ""
Write-Host "Visit http://localhost:3000 to see your demo!" -ForegroundColor Cyan
