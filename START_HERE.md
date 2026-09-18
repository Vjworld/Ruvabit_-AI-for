# GhostTracker + Local LiteLLM Startup Cheat Sheet

Use this when you need to get the app and local AI proxy running again.

## Quick start

### 1) Open the project folder

```powershell
cd "C:\Users\vroff\1SIDEHustle\1FAST IMPLEMENT\ghosttracker"
```

### 2) Start the LiteLLM proxy

```powershell
python -m litellm.proxy.proxy_cli --config litellm_config.yaml --port 4000
```

### 3) Start the app

```powershell
node server.js
```

### 4) Verify the local AI API

```powershell
curl -X POST http://localhost:4000/v1/chat/completions `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer sk-local" `
  -d '{"model":"auto-coder","messages":[{"role":"user","content":"Ping test: confirm agent connection."}]}'
```

Expected: JSON response from the proxy.

## Working values

- Base URL: http://localhost:4000/v1
- API Key: sk-local
- Model: auto-coder

Optional model names:
- gemini-primary
- cerebras-backup
- nvidia-backup
- openrouter-backup
- sambanova-backup

## One-click PowerShell launcher

Run this from the project root:

```powershell
.\start-local-ai.ps1
```

This script starts both services:
- LiteLLM proxy on port 4000
- Node app server

## Troubleshooting

### LiteLLM fails to start
- Make sure you are in the project root.
- Confirm LiteLLM is installed: `pip install litellm`
- Check the config file: `litellm_config.yaml`

### Port 4000 is already in use
- Stop the old process or change the port.
- Check if another LiteLLM instance is already running.

### App does not connect to AI
- Confirm the proxy is running.
- Confirm the Base URL is `http://localhost:4000/v1`
- Confirm the API key is `sk-local`
- Confirm the model is `auto-coder`

## Useful note

The local AI setup is intentionally OpenAI-compatible, so many VS Code and app integrations can use the same pattern as a normal OpenAI endpoint.
