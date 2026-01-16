# Server Configuration

## Port Configuration

### Backend (Proxy Server)
- **Port**: 3001
- **File**: `proxy-server.js`
- **Purpose**: Proxy requests to Hugging Face API to bypass CORS
- **Health Check**: http://localhost:3001/health

### Frontend (Vite React App)
- **Port**: 5173 (default, will try 5174, 5175, etc. if in use)
- **File**: `vite.config.ts`
- **Purpose**: React application UI
- **URL**: http://localhost:5173

## API Keys (from .env)

All API keys are loaded from the `.env` file:

```env
VITE_HUGGINGFACE_API_KEY=your-huggingface-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=sk-proj-oVqjBR8nyPPinqhwIrzT... (your key)
```

## Quick Demo Configuration

The **Quick Demo** tab uses:
- **API**: OpenAI DALL-E 3
- **Key Source**: `VITE_OPENAI_API_KEY` from `.env`
- **Model**: dall-e-3
- **Theme**: Birthday party portraits
- **Resolution**: 1024x1024
- **Quality**: Standard
- **Cost**: ~$0.04 per image

## Starting Servers

### Option 1: Both servers together (Recommended)
```bash
npm start
```

### Option 2: Separate terminals
Terminal 1:
```bash
npm run proxy
```

Terminal 2:
```bash
npm run dev
```

## Verify Configuration

After starting servers, check:
1. **Proxy**: http://localhost:3001/health should return `{"status":"ok","message":"Proxy server is running"}`
2. **Frontend**: http://localhost:5173 should load the React app
3. **Console**: Check browser console (F12) to see if OpenAI key is loaded

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
1. Find process: `netstat -ano | findstr :3001` or `netstat -ano | findstr :5173`
2. Kill process: `taskkill //F //PID <PID>`

### OpenAI Key Not Loading
1. Verify `.env` file has `VITE_OPENAI_API_KEY=sk-proj-...`
2. Restart servers after editing `.env`
3. Clear browser localStorage: `localStorage.clear()`
4. Refresh browser

### API Key Priority
Keys are loaded in this order:
1. `.env` file (`VITE_*` variables)
2. `localStorage` (set via app UI)
3. Hardcoded defaults (for HF and Gemini only)

## Current Setup

✅ **Proxy Server**: Port 3001
✅ **React App**: Port 5173 (auto-increments if busy)
✅ **OpenAI Key**: Configured in .env
✅ **Quick Demo**: Uses OpenAI DALL-E 3
