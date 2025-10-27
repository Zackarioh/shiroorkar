VoiceApp — demo voice recognition website

This is a static demo that implements a client-side login/register flow and demo voice recognition using the Web Speech API.

Files added/updated:

How to run
1. Open `index.html` in a modern browser (Chrome or Edge recommended).
2. Register a username and password (demo only — stored in localStorage).
3. Log in and visit Home or Work pages.

Notes

Next steps you might want:
VoiceApp — minimal login + voice-to-text demo

This is a static, two-page site with:
- `index.html`: Login/Register (client-side, demo only)
- `home.html`: Voice recognition (start/stop), shows transcript, saves simple history per user

Everything is client-side using localStorage (not for production).

How to run
1. Open `index.html` in Chrome or Edge.
2. Register a demo user, then log in.
3. On Home, click Start Listening, allow the mic, speak, then Stop. Download transcript if desired.

Deploy to Cloudflare Pages (optional)
```powershell
npm install -g wrangler
wrangler login
wrangler pages project create voiceapp
wrangler pages publish . --project-name=voiceapp --branch=main
```

Notes
- Uses the Web Speech API — best supported in Chrome/Edge.
- Credentials and transcripts are stored in localStorage.
- For production, replace with server-side auth + storage.
