
Write-Host " Starting Doneche / GhostTracker Stack..." -ForegroundColor Cyan

# 1. Start Ollama offline backup silently
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden -ErrorAction SilentlyContinue

# 2. Launch LiteLLM Proxy in a background terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m litellm.proxy.proxy_cli --config litellm_config.yaml --port 4000"

# 3. Start Node.js backend server using the project entrypoint
Write-Host " Node server starting on http://localhost:3000..." -ForegroundColor Green
node server.js
