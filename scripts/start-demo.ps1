$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiPython = Join-Path $root ".venv\Scripts\python.exe"
$apiDir = Join-Path $root "apps\api"
$webDir = Join-Path $root "apps\web"
$logsDir = Join-Path $root "logs"

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

if (!(Test-Path $apiPython)) {
  Write-Host "Creating root Python environment..."
  python -m venv (Join-Path $root ".venv")
  & $apiPython -m pip install -e "$apiDir[dev]"
}

if (!(Test-Path (Join-Path $webDir "node_modules"))) {
  Write-Host "Installing frontend dependencies..."
  Push-Location $webDir
  npm.cmd install
  Pop-Location
}

Write-Host "Starting Phoenix API on http://127.0.0.1:8000"
Start-Process -FilePath $apiPython `
  -ArgumentList @("-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000") `
  -WorkingDirectory $apiDir `
  -WindowStyle Hidden

Write-Host "Starting Phoenix Web on http://localhost:3000"
Start-Process -FilePath "npm.cmd" `
  -ArgumentList @("run", "dev") `
  -WorkingDirectory $webDir `
  -RedirectStandardOutput (Join-Path $logsDir "web.log") `
  -RedirectStandardError (Join-Path $logsDir "web.err.log") `
  -WindowStyle Hidden

Write-Host ""
Write-Host "Phoenix is starting."
Write-Host "Open http://localhost:3000"
Write-Host "Logs are in $logsDir"
