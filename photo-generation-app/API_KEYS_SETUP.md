# API Keys Setup Guide

## Quick Setup - OpenAI API Key (Recommended)

The demo page now uses **OpenAI DALL-E 3** for reliable image generation.

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)

### Step 2: Add Key to .env File

1. Open the `.env` file in the project root
2. Replace `your-openai-api-key-here` with your actual key:

```env
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

3. Save the file

### Step 3: Restart the Application

```bash
# Stop the current servers (Ctrl+C)
# Then restart:
npm start
```

The app will automatically load the key from the `.env` file!

---

## Alternative: Add Key via Browser Console

If you don't want to use the `.env` file, you can add the key directly in the browser:

1. Open the app: http://localhost:5178
2. Open browser console (F12)
3. Run this command:

```javascript
localStorage.setItem('api_key_openai', 'sk-your-actual-key-here');
```

4. Refresh the page

---

## All Available API Keys

The `.env` file supports three API providers:

```env
# Hugging Face (Free - but many models returning 410 errors)
VITE_HUGGINGFACE_API_KEY=your-huggingface-api-key

# Google Gemini (Free tier available)
VITE_GEMINI_API_KEY=your-gemini-api-key

# OpenAI (Paid - Most reliable) ⭐ RECOMMENDED
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

---

## Cost Information

### OpenAI DALL-E 3
- **Standard Quality**: $0.040 per image (1024x1024)
- **HD Quality**: $0.080 per image (1024x1024 or 1792x1024)
- Very reliable, high quality results
- Generates in ~20-30 seconds

### OpenAI DALL-E 2
- **Cost**: $0.020 per image (1024x1024)
- Faster and cheaper than DALL-E 3
- Good quality for testing

---

## Troubleshooting

### Error: "OpenAI API key not configured"
- Make sure you added your key to the `.env` file
- Restart the application after editing `.env`
- Check that the key starts with `sk-`

### Error: "Invalid API key"
- Verify your key is correct and active
- Check your OpenAI account has credits
- Go to https://platform.openai.com/account/usage to check

### Hugging Face models returning 410 errors
- Many Stable Diffusion models on HF Inference API have been removed
- Use OpenAI instead (more reliable)
- Or wait for HF to update their model availability

---

## Security Note

⚠️ **Important**: The `.env` file is for local development only.

- Never commit `.env` to Git (it's in `.gitignore`)
- Never share your API keys publicly
- For production, use environment variables on your hosting platform

---

## Quick Test

After adding your OpenAI key:

1. Go to http://localhost:5178
2. Click on **"Quick Demo"** tab
3. Upload a photo
4. Click **"Generate Birthday Photo"**
5. Wait ~20-30 seconds
6. Your birthday-themed photo will appear!

---

## Need Help?

If you have issues:
1. Check the browser console for errors (F12)
2. Verify your API key is correct
3. Make sure you restarted the app after editing `.env`
4. Check your OpenAI account has sufficient credits
