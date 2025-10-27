export class Auth {
  constructor(){ this.USERS='vox_users'; this.TOKEN='vox_token'; }
  users(){ try{ return JSON.parse(localStorage.getItem(this.USERS)||'{}'); }catch{return{}} }
  saveUsers(u){ localStorage.setItem(this.USERS, JSON.stringify(u)); }
  hash(p){ return btoa(p); }
  register(username, password){
    if(!username||!password) return {ok:false,message:'Provide username & password'};
    const u = this.users(); if(u[username]) return {ok:false,message:'User exists'};
    u[username] = { pw: this.hash(password), created: Date.now() };
    this.saveUsers(u); return {ok:true};
  }
  login(username,password){ const u=this.users()[username]; if(!u) return {ok:false,message:'User not found'}; if(u.pw!==this.hash(password)) return {ok:false,message:'Invalid password'}; localStorage.setItem(this.TOKEN, username); return {ok:true}; }
  logout(){ localStorage.removeItem(this.TOKEN); }
  currentUser(){ return localStorage.getItem(this.TOKEN); }
}
