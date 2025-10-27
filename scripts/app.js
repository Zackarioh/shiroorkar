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
  }
  function writeUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function setToken(username){ localStorage.setItem(TOKEN_KEY, username); }
  function getToken(){ return localStorage.getItem(TOKEN_KEY); }
  function clearToken(){ localStorage.removeItem(TOKEN_KEY); }

  function hashPassword(pw){
    // simple base64 to avoid plain text; not secure
    return btoa(pw);
  }

  // Auth functions
  function registerUser(username, password){
    const users = readUsers();
    if(users[username]) return {ok:false, message:'User exists'};
    users[username] = {password: hashPassword(password), created: Date.now()};
    writeUsers(users);
    return {ok:true};
  }
  function loginUser(username, password){
    const users = readUsers();
    if(!users[username]) return {ok:false, message:'User not found'};
    if(users[username].password !== hashPassword(password)) return {ok:false, message:'Invalid password'};
    setToken(username);
    return {ok:true};
  }
  function deleteUser(username){
    const users = readUsers();
    delete users[username];
    writeUsers(users);
    localStorage.removeItem(`voiceapp_${username}_history`);
    clearToken();
  }

  // History helpers
  function getHistory(username){
    try{ return JSON.parse(localStorage.getItem(`voiceapp_${username}_history`)||'[]'); }catch(e){return []}
  }
  function pushHistory(username, item){
    const h = getHistory(username);
    h.unshift(item);
    // keep a reasonable limit
    if(h.length>200) h.length=200;
    localStorage.setItem(`voiceapp_${username}_history`, JSON.stringify(h));
  }

  // Page helpers
  function showMessage(el, text, ok=true){ if(!el) return; el.textContent = text; el.className = ok? 'message success' : 'message error'; setTimeout(()=>{el.textContent=''; el.className='message';},4000); }

  // Auth UI wiring on index (login/register)
  function wireAuthPage(){
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginMsg = document.getElementById('login-message');
    const regMsg = document.getElementById('reg-message');

    tabLogin.addEventListener('click', ()=>{ tabLogin.classList.add('active'); tabRegister.classList.remove('active'); loginForm.classList.remove('hidden'); regForm.classList.add('hidden'); });
    tabRegister.addEventListener('click', ()=>{ tabRegister.classList.add('active'); tabLogin.classList.remove('active'); regForm.classList.remove('hidden'); loginForm.classList.add('hidden'); });

    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value;
      const r = loginUser(u,p);
      if(!r.ok){ showMessage(loginMsg, r.message, false); return; }
      window.location.href = 'home.html';
    });

    regForm.addEventListener('submit', e=>{
      e.preventDefault();
      const u = document.getElementById('reg-username').value.trim();
      const p = document.getElementById('reg-password').value;
      if(!u || !p){ showMessage(regMsg, 'Provide username & password', false); return; }
      const r = registerUser(u,p);
      if(!r.ok){ showMessage(regMsg, r.message, false); return; }
      showMessage(regMsg, 'Account created. You can now log in', true);
      // switch to login tab
      tabLogin.click();
    });
  }

  // Protect pages - if no token, redirect to index
  function requireAuth(){
    const username = getToken();
    if(!username){ window.location.href = 'index.html'; return null; }
    return username;
  }

  // Nav wiring for pages with nav elements
  function wireNav(){
    const logoutBtns = Array.from(document.querySelectorAll('#logout-btn'));
    logoutBtns.forEach(b=>b && b.addEventListener('click', ()=>{ clearToken(); window.location.href='index.html'; }));
    const username = getToken();
    const navUserEls = document.querySelectorAll('#nav-user');
    navUserEls.forEach(el=>{ if(username) el.textContent = username; });
  }

  // Voice recognition core
  function createRecognizer(onResult, onStart, onEnd, continuous=true){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    r.interimResults = true;
    r.continuous = continuous;
    r.lang = navigator.language || 'en-US';
    r.onresult = onResult;
    r.onstart = onStart;
    r.onend = onEnd;
    r.onerror = (e)=>{ console.error('Speech error', e); };
    return r;
  }

  // Page-specific: Home
  function wireHome(){
    const username = requireAuth(); if(!username) return;
    wireNav();
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const transcriptEl = document.getElementById('transcript');
    const historyList = document.getElementById('history-list');

    let finalTranscript = '';
    let recognition = createRecognizer((ev)=>{
      let interim = '';
      for(let i=ev.resultIndex;i<ev.results.length;i++){
        const res = ev.results[i];
        if(res.isFinal){ finalTranscript += res[0].transcript + '\n'; }
        else { interim += res[0].transcript; }
      }
      transcriptEl.textContent = finalTranscript + interim;
    }, ()=>{
      startBtn.disabled = true; stopBtn.disabled = false;
    }, ()=>{
      startBtn.disabled = false; stopBtn.disabled = true;
      // save a snapshot
      if(finalTranscript.trim()){
        pushHistory(username, {text: finalTranscript.trim(), date: Date.now(), page:'home'});
        renderHistory();
      }
    });

    function renderHistory(){
      const h = getHistory(username);
      historyList.innerHTML = '';
      h.slice(0,100).forEach(item=>{
        const li = document.createElement('li');
        const d = new Date(item.date).toLocaleString();
        li.textContent = `${d} — ${item.text.substring(0,120)}`;
        historyList.appendChild(li);
      });
    }

    startBtn.addEventListener('click', ()=>{
      if(!recognition){ alert('SpeechRecognition not supported in this browser'); return; }
      finalTranscript = '';
      transcriptEl.textContent = '';
      recognition.start();
    });
    stopBtn.addEventListener('click', ()=>{ if(recognition) recognition.stop(); });
    clearBtn.addEventListener('click', ()=>{ finalTranscript=''; transcriptEl.textContent=''; });
    downloadBtn.addEventListener('click', ()=>{
      const blob = new Blob([transcriptEl.textContent || ''], {type:'text/plain'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `transcript_${username}_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    renderHistory();
  }

  // No additional pages in minimal version

  // Init dispatcher
  document.addEventListener('DOMContentLoaded', ()=>{
    const path = location.pathname.split('/').pop();
    if(!path || path === 'index.html'){
      // index/login page
      wireAuthPage();
      return;
    }
    // other pages require auth
    if(path === 'home.html') wireHome();
  });

})();
