VoxNote — voice-to-text website (from scratch)

Fresh build with:
- index.html — login/register (client-side demo only)
- record.html — voice recognition (start/pause/resume/stop, title, language)
- transcripts.html — saved transcripts list (view, download, delete)
- scripts/ (ES modules): auth.js, store.js, speech.js, app.mjs
- styles/styles.css — new design

Run
- Open `index.html` in Chrome or Edge, allow microphone.
- Register a demo user and log in.
- Record and save transcripts; manage them in Transcripts.

Cloudflare Pages (optional)
```powershell
npm install -g wrangler
wrangler login
wrangler pages project create voxnote
wrangler pages publish . --project-name=voxnote --branch=main
```

Notes
- Uses the Web Speech API (SpeechRecognition) — works best in Chrome/Edge.
- Demo-only auth and storage in localStorage; not for production.
