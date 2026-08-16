export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const pct=(n,d=0)=>Number.isFinite(Number(n))?`${(Number(n)*100).toFixed(d)}%`:'0%';
export const esc=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const fmtNumber=n=>new Intl.NumberFormat('pt-BR').format(Number(n||0));
export const isoDate=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
export const dateBR=(v)=>{if(!v)return '—';const d=new Date(`${v}T12:00:00`);return new Intl.DateTimeFormat('pt-BR').format(d)};
export function secondsToClock(total=0, includeSeconds=false){
  total=Math.max(0,Math.round(Number(total)||0));const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
  return includeSeconds?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${h}:${String(m).padStart(2,'0')}`;
}
export function minutesToClock(min=0){return secondsToClock(Number(min||0)*60,false)}
export function clockToMinutes(value){
  const s=String(value||'').trim();if(!s)return 0;if(/^\d+(?:[.,]\d+)?$/.test(s))return Math.round(Number(s.replace(',','.'))*60);
  const m=s.match(/^(\d{1,3}):([0-5]\d)$/);if(!m)return NaN;return Number(m[1])*60+Number(m[2]);
}
export const uid=(p='id')=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export function downloadJSON(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export function debounce(fn,wait=180){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),wait)}}
export function normalizeText(v=''){return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
export const matterSlug=v=>normalizeText(v).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function groupBy(arr,key){return arr.reduce((a,x)=>{const k=typeof key==='function'?key(x):x[key];(a[k]??=[]).push(x);return a},{})}
export function dayName(day=new Date().getDay()){return ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'][day]}
