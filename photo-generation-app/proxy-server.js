import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all origins (restrict in production)
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Hugging Face proxy endpoint
app.post('/api/huggingface/:model(*)', async (req, res) => {
  const modelPath = req.params.model;
  const apiKey = req.headers.authorization;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  try {
    console.log(`Proxying request to Hugging Face model: ${modelPath}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const response = await fetch(`https://api-inference.huggingface.co/models/${modelPath}`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log(`Response status: ${response.status}`);

    // Handle different response types
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else if (contentType && contentType.includes('image/')) {
      // Forward image as binary
      const buffer = await response.buffer();
      res.set('Content-Type', contentType);
      return res.send(buffer);
    } else {
      // Default to buffer for other types
      const buffer = await response.buffer();
      res.set('Content-Type', contentType || 'application/octet-stream');
      return res.send(buffer);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    });
  }
});

// Hugging Face authentication test endpoint
app.get('/api/huggingface/:model(*)', async (req, res) => {
  const modelPath = req.params.model;
  const apiKey = req.headers.authorization;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelPath}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Auth test error:', error);
    res.status(500).json({
      error: 'Authentication test failed',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
