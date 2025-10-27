/*
  app.js - handles simple client-side auth and Web Speech API interactions.
  Demo-only: stores credentials in localStorage (base64). Not secure for production.
*/

(function(){
  'use strict';

  // Simple storage helpers
  const USERS_KEY = 'voiceapp_users';
  const TOKEN_KEY = 'voiceapp_token';

  function readUsers(){
    try{
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    }catch(e){return {};}
  // app.js (module) for VoxNote: guards + page wiring
  import { Auth } from './auth.js';
  import { Store } from './store.js';
  import { Recognizer } from './speech.js';

  const auth = new Auth();
  const store = new Store();

  function guard() {
    const u = auth.currentUser();
    if (!u) { location.href = 'index.html'; return null; }
    return u;
  }

  function wireAuthPage() {
    // Redirect if already logged in
    if (auth.currentUser()) { location.href = 'record.html'; return; }

    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginMsg = document.getElementById('login-message');
    const regMsg = document.getElementById('reg-message');

    tabLogin?.addEventListener('click', ()=>{ tabLogin.classList.add('active'); tabRegister.classList.remove('active'); loginForm.classList.remove('hidden'); regForm.classList.add('hidden'); });
    tabRegister?.addEventListener('click', ()=>{ tabRegister.classList.add('active'); tabLogin.classList.remove('active'); regForm.classList.remove('hidden'); loginForm.classList.add('hidden'); });

    loginForm?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value;
      const r = auth.login(u,p);
      if(!r.ok){ show(loginMsg, r.message, false); return; }
      location.href = 'record.html';
    });

    regForm?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('reg-username').value.trim();
      const p = document.getElementById('reg-password').value;
      const r = auth.register(u,p);
      if(!r.ok){ show(regMsg, r.message, false); return; }
      show(regMsg, 'Account created. You can now log in', true);
      tabLogin?.click();
    });
  }

  function wireNav() {
    const u = auth.currentUser();
    document.querySelectorAll('#nav-user').forEach(el => el.textContent = u || '');
    document.querySelectorAll('#logout-btn').forEach(btn => btn.addEventListener('click', ()=>{ auth.logout(); location.href='index.html'; }));
  }

  function show(el, text, ok=true){ if(!el) return; el.textContent = text; el.className = ok? 'message success' : 'message error'; setTimeout(()=>{ el.textContent=''; el.className='message'; }, 3500); }

  function wireRecordPage(){
    const user = guard(); if(!user) return; wireNav();
    const transcriptEl = document.getElementById('transcript');
    const statusEl = document.getElementById('status');
    const langSelect = document.getElementById('lang-select');
    const titleEl = document.getElementById('note-title');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');
    const downloadBtn = document.getElementById('download-btn');

    let finalTxt = '';
    const rec = new Recognizer({
      onStart(){ statusEl.textContent = 'Listening…'; startBtn.disabled=true; pauseBtn.disabled=false; stopBtn.disabled=false; resumeBtn.disabled=true; },
      onEnd(){ statusEl.textContent = 'Stopped.'; startBtn.disabled=false; pauseBtn.disabled=true; stopBtn.disabled=true; resumeBtn.disabled=true; },
      onError(e){ statusEl.textContent = 'Error: '+(e.error||'unknown'); },
      onResult({finalText, interimText}){ finalTxt += finalText; transcriptEl.textContent = finalTxt + interimText; }
    });

    startBtn.addEventListener('click', ()=>{ rec.lang = langSelect.value; finalTxt=''; transcriptEl.textContent=''; rec.start(); });
    pauseBtn.addEventListener('click', ()=>{ rec.pause(); pauseBtn.disabled=true; resumeBtn.disabled=false; statusEl.textContent='Paused'; });
    resumeBtn.addEventListener('click', ()=>{ rec.resume(); pauseBtn.disabled=false; resumeBtn.disabled=true; statusEl.textContent='Listening…'; });
    stopBtn.addEventListener('click', ()=> rec.stop());
    clearBtn.addEventListener('click', ()=>{ finalTxt=''; transcriptEl.textContent=''; });
    saveBtn.addEventListener('click', ()=>{
      const text = transcriptEl.textContent.trim(); if(!text){ alert('Nothing to save'); return; }
      const title = (titleEl.value || 'Untitled').trim();
      store.save(user, { id: Date.now().toString(), title, text, lang: langSelect.value, date: Date.now() });
      alert('Saved');
    });
    downloadBtn.addEventListener('click', ()=>{
      const blob = new Blob([transcriptEl.textContent || ''], {type:'text/plain'});
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${(titleEl.value||'note')}_${Date.now()}.txt`; a.click(); URL.revokeObjectURL(a.href);
    });
  }

  function wireTranscriptsPage(){
    const user = guard(); if(!user) return; wireNav();
    const list = document.getElementById('transcript-list');
    const empty = document.getElementById('empty-msg');
    const items = store.list(user);
    list.innerHTML = '';
    if(!items.length){ empty.style.display='block'; return; } else empty.style.display='none';
    for(const it of items){
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.innerHTML = `<strong>${escapeHtml(it.title)}</strong><div class="muted">${new Date(it.date).toLocaleString()} • ${it.lang}</div>`;
      const right = document.createElement('div'); right.style.display='flex'; right.style.gap='8px';
      const viewBtn = btn('View');
      const dlBtn = btn('Download');
      const delBtn = btn('Delete');
      viewBtn.addEventListener('click', ()=>{ alert(it.text); });
      dlBtn.addEventListener('click', ()=>{ const b=new Blob([it.text],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=`${slug(it.title)}.txt`; a.click(); URL.revokeObjectURL(a.href); });
      delBtn.addEventListener('click', ()=>{ if(confirm('Delete this transcript?')){ store.remove(user, it.id); li.remove(); if(!list.children.length) empty.style.display='block'; } });
      right.append(viewBtn, dlBtn, delBtn);
      li.append(left, right);
      list.appendChild(li);
    }
  }

  function btn(txt){ const b=document.createElement('button'); b.className='btn small'; b.textContent=txt; return b; }
  function slug(s){ return (s||'note').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }

  // Router
  const page = location.pathname.split('/').pop() || 'index.html';
  if(page==='index.html') wireAuthPage();
  else if(page==='record.html') wireRecordPage();
  else if(page==='transcripts.html') wireTranscriptsPage();
  else { /* no-op */ }
      for(let i=ev.resultIndex;i<ev.results.length;i++){
