# 🚀 STARTLABX - Quick Start Script
# This script sets up and runs the entire application

Write-Host "🚀 STARTLABX - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Install backend dependencies if needed
if (-not (Test-Path "backend-api/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend-api
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
    Set-Location ..
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Generate Prisma client
Write-Host "🗄️  Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Setup database if needed
if (-not (Test-Path "prisma/dev.db")) {
    Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
    npx prisma db push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to setup database" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Database created" -ForegroundColor Green
    Write-Host ""

    # Seed database
    Write-Host "🌱 Seeding database with demo data..." -ForegroundColor Yellow
    npm run db:seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Warning: Failed to seed database (continuing anyway)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Database seeded" -ForegroundColor Green
    }
    Write-Host ""
}

# Display startup information
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Starting STARTLABX..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Yellow
Write-Host "   Frontend:     http://localhost:3002" -ForegroundColor White
Write-Host "   Backend API:  http://localhost:8080" -ForegroundColor White
Write-Host "   Health Check: http://localhost:8080/health" -ForegroundColor White
Write-Host ""
Write-Host "👤 Demo Accounts:" -ForegroundColor Yellow
Write-Host "   Email: john@example.com" -ForegroundColor White
Write-Host "   Email: sarah@example.com" -ForegroundColor White
Write-Host "   Email: mike@example.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop: Press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Start all services
Write-Host "🚀 Launching services..." -ForegroundColor Cyan
Write-Host ""

# Run dev:all script (which uses concurrently)
npm run dev:all
