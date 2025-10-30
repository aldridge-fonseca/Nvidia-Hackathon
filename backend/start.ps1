# CrisisVision Backend - Quick Start (PowerShell)

Write-Host "🚀 CrisisVision Backend - Quick Start" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found!" -ForegroundColor Yellow
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env and add your NVIDIA_API_KEY" -ForegroundColor Yellow
    Write-Host "   Get your key from: https://build.nvidia.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Enter after you've added your API key to .env..." -ForegroundColor Yellow
    Read-Host
}

$envContent = Get-Content .env | Out-String
if ($envContent -notmatch "NVIDIA_API_KEY=.+" -or $envContent -match "your_nvidia_api_key_here") {
    Write-Host "❌ NVIDIA_API_KEY not set in .env file" -ForegroundColor Red
    Write-Host "   Please edit .env and add your actual API key" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment configured" -ForegroundColor Green
Write-Host ""

Write-Host "🐳 Building Docker containers..." -ForegroundColor Cyan
docker-compose build

Write-Host ""
Write-Host "🚀 Starting all services..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🔍 Checking service health..." -ForegroundColor Cyan

$services = @(
    @{name="orchestrator"; port=8000},
    @{name="weather"; port=8001},
    @{name="maps"; port=8002},
    @{name="news"; port=8003},
    @{name="social"; port=8004},
    @{name="resource"; port=8005}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.port)/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.name) (port $($service.port)) - healthy" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $($service.name) (port $($service.port)) - not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 CrisisVision Backend is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Available endpoints:" -ForegroundColor Cyan
Write-Host "   - Orchestrator API: http://localhost:8000"
Write-Host "   - API Documentation: http://localhost:8000/docs"
Write-Host "   - Weather MCP: http://localhost:8001"
Write-Host "   - Maps MCP: http://localhost:8002"
Write-Host "   - News MCP: http://localhost:8003"
Write-Host "   - Social MCP: http://localhost:8004"
Write-Host "   - Resource MCP: http://localhost:8005"
Write-Host ""
Write-Host "🧪 Test the system:" -ForegroundColor Cyan
Write-Host '   $body = @{scenario="Fire alarm"; location="Library"; emergency_type="fire"} | ConvertTo-Json'
Write-Host '   Invoke-RestMethod -Uri http://localhost:8000/test -Method Post -Body $body -ContentType "application/json"'
Write-Host ""
Write-Host "📖 See TESTING.md for more test commands" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 To stop all services: docker-compose down" -ForegroundColor Yellow
Write-Host "📋 To view logs: docker-compose logs -f" -ForegroundColor Yellow
