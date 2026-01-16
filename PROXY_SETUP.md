# Proxy Server Setup

## Why We Need a Proxy

The application uses a proxy server to bypass CORS (Cross-Origin Resource Sharing) restrictions when making API calls to Hugging Face from a browser environment.

**CORS Issue**: Browsers block requests from `http://localhost:5175` to `https://api-inference.huggingface.co` due to security policies.

**Solution**: Run a Node.js proxy server that:
1. Receives requests from the React frontend (no CORS issues)
2. Forwards them to Hugging Face API (server-to-server, no CORS)
3. Returns responses back to the frontend

## Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm start
```
This will start both:
- Proxy server on `http://localhost:3001`
- Vite dev server on `http://localhost:5175`

### Option 2: Run Servers Separately

Terminal 1 - Proxy Server:
```bash
npm run proxy
```

Terminal 2 - React App:
```bash
npm run dev
```

## How It Works

1. **Frontend** makes requests to `http://localhost:3001/api/huggingface/{model}`
2. **Proxy Server** receives the request and forwards it to `https://api-inference.huggingface.co/models/{model}`
3. **Hugging Face API** processes the request and returns the image
4. **Proxy Server** forwards the image back to the frontend
5. **Frontend** displays the generated image

## Endpoints

### Proxy Health Check
```
GET http://localhost:3001/health
```

### Image Generation
```
POST http://localhost:3001/api/huggingface/{model-path}
Headers: Authorization: Bearer {api-key}
Body: { inputs, parameters, options }
```

## Configuration

The proxy server configuration is in `proxy-server.js`:
- Port: 3001 (can be changed if needed)
- CORS: Enabled for all origins (restrict in production)
- Supported methods: GET (health check, auth test), POST (image generation)

## Troubleshooting

### Port Already in Use
If port 3001 is already in use:
1. Stop the process using that port
2. Or change the PORT in `proxy-server.js`
3. Update `API_ENDPOINTS.huggingface` in `src/config/apiConfigs.ts`

### Connection Refused
Make sure the proxy server is running before starting the React app.

### Authentication Errors
Verify your Hugging Face API key is correct and has not expired.
