export class Recognizer{
  constructor({onStart,onEnd,onError,onResult}={}){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this._SR = SR ? new SR() : null;
    this._onStart = onStart; this._onEnd = onEnd; this._onError = onError; this._onResult = onResult;
    this._listening = false; this.lang = navigator.language || 'en-US';
    if(this._SR){
      this._SR.interimResults = true;
      this._SR.continuous = true;
      this._SR.lang = this.lang;
      this._SR.onstart = ()=>{ this._listening=true; this._onStart&&this._onStart(); };
      this._SR.onend = ()=>{ this._listening=false; this._onEnd&&this._onEnd(); };
      this._SR.onerror = (e)=>{ this._onError&&this._onError(e); };
      this._SR.onresult = (ev)=>{
        let interim = '', fin = '';
        for(let i=ev.resultIndex;i<ev.results.length;i++){
          const r=ev.results[i];
          if(r.isFinal) fin += r[0].transcript;
          else interim += r[0].transcript;
        }
        this._onResult && this._onResult({finalText: fin, interimText: interim});
      };
    }
  }
  get supported(){ return !!this._SR; }
  start(){ if(!this._SR){ alert('SpeechRecognition not supported'); return; } this._SR.lang=this.lang; this._SR.start(); }
  stop(){ this._SR?.stop(); }
  pause(){ this._SR?.stop(); }
  resume(){ this._SR?.start(); }
}
