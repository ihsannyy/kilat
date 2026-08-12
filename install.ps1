# Kilat Installer for Windows PowerShell
$ErrorActionPreference = "Stop"

$Repo = "cilldev/kilat"
$Version = "v3.1.0"
$BinaryName = "kilat.exe"

Write-Host "⚡ Kilat Installer (Windows)" -ForegroundColor Magenta

# Detect Architecture
$Arch = "amd64"
if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64") {
    $Arch = "arm64"
} elseif ($env:PROCESSOR_ARCHITECTURE -eq "x86") {
    $Arch = "386"
}

$AssetName = "kilat-windows-$Arch.exe"
$Url = "https://github.com/$Repo/releases/download/$Version/$AssetName"

# Choose Installation Target Directory
$BinDir = "$env:USERPROFILE\.kilat\bin"
if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

$TargetPath = Join-Path $BinDir $BinaryName

Write-Host "📡 Mengunduh $AssetName dari GitHub..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $Url -OutFile $TargetPath

Write-Host "✨ Kilat $Version berhasil terpasang di $TargetPath" -ForegroundColor Green

# Auto-add to User PATH environment variable if not already present
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    Write-Host "⚙️ Menambahkan $BinDir ke PATH User..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$UserPath;$BinDir", "User")
    $env:Path += ";$BinDir"
    Write-Host "✅ PATH berhasil diperbarui!" -ForegroundColor Green
}

Write-Host "⚡ Jalankan 'kilat --version' untuk menguji installation!" -ForegroundColor Cyan
