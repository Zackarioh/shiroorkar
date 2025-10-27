export class Store{
  key(user){ return `vox_${user}_notes`; }
  list(user){ try{ return JSON.parse(localStorage.getItem(this.key(user))||'[]'); }catch{return[]} }
  save(user, item){ const arr=this.list(user); arr.unshift(item); if(arr.length>500) arr.length=500; localStorage.setItem(this.key(user), JSON.stringify(arr)); }
  remove(user, id){ const arr=this.list(user).filter(x=>x.id!==id); localStorage.setItem(this.key(user), JSON.stringify(arr)); }
}
