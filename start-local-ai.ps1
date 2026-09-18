$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
Set-Location $projectRoot

Write-Host "Starting LiteLLM proxy..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot'; python -m litellm.proxy.proxy_cli --config litellm_config.yaml --port 4000" -WorkingDirectory $projectRoot

Start-Sleep -Seconds 3

Write-Host "Starting GhostTracker app..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot'; node server.js" -WorkingDirectory $projectRoot

Write-Host "" 
Write-Host "Local services started:" -ForegroundColor Green
Write-Host "  - LiteLLM: http://localhost:4000/v1" -ForegroundColor Green
Write-Host "  - App:     http://localhost:3000" -ForegroundColor Green
Write-Host "" 
Write-Host "Use these values in your AI client:" -ForegroundColor Yellow
Write-Host "  Base URL: http://localhost:4000/v1" 
Write-Host "  API Key:  sk-local" 
Write-Host "  Model:    auto-coder" 
Write-Host "" 
Write-Host "To verify the proxy is alive, run:" -ForegroundColor Yellow
Write-Host "  curl -X POST http://localhost:4000/v1/chat/completions -H \"Content-Type: application/json\" -H \"Authorization: Bearer sk-local\" -d '{\"model\":\"auto-coder\",\"messages\":[{\"role\":\"user\",\"content\":\"Ping test: confirm agent connection.\"}]}'" 
