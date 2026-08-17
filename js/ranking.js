export function clampNumber(value,min,max){
  const n=Number(value);if(!Number.isFinite(n))return min;return Math.min(max,Math.max(min,n));
}

export function cebraspeExpectedScore(items,accuracy){
  const n=Math.max(0,Number(items)||0),p=clampNumber(accuracy,0,1);
  return n*(1.5*p-.5);
}

export function practiceBlockProjection(questionRows,subjects,items){
  const set=new Set(subjects||[]);let questions=0,correct=0;
  for(const row of questionRows||[]){if(!set.has(row.subject))continue;questions+=Number(row.questions||0);correct+=Number(row.correct||0)}
  if(questions<=0)return{questions:0,correct:0,accuracy:null,score:null,projectedCorrect:null,projectedErrors:null,confidence:'Sem amostra'};
  const accuracy=correct/questions,projectedCorrect=items*accuracy,projectedErrors=items-projectedCorrect;
  let confidence='Amostra inicial';if(questions>=300)confidence='Amostra robusta';else if(questions>=120)confidence='Amostra boa';else if(questions>=50)confidence='Amostra moderada';
  return{questions,correct,accuracy,score:cebraspeExpectedScore(items,accuracy),projectedCorrect,projectedErrors,confidence};
}

export function filterRankingCandidates(candidates,filter='all'){
  const list=Array.isArray(candidates)?candidates:[];if(filter==='all')return list;
  return list.filter(c=>{const m=String(c.modalidade||'').toLowerCase();if(filter==='geral')return m.includes('lista geral');if(filter==='negros')return m.includes('negro');if(filter==='pcd')return m.includes('pcd');return true});
}

export function equivalentPosition(score,candidates,field='final'){
  const s=Number(score);if(!Number.isFinite(s)||!candidates?.length)return null;
  return 1+candidates.filter(c=>Number(c[field])>s).length;
}

export function percentile(score,candidates,field='final'){
  const s=Number(score);if(!Number.isFinite(s)||!candidates?.length)return null;
  const belowOrEqual=candidates.filter(c=>Number(c[field])<=s).length;
  return belowOrEqual/candidates.length;
}

export function nearbyRanking(score,candidates,field='final',radius=4){
  if(!candidates?.length)return[];const sorted=[...candidates].sort((a,b)=>Number(b[field])-Number(a[field]));
  const pos=equivalentPosition(score,sorted,field)||sorted.length+1,index=Math.min(sorted.length,Math.max(0,pos-1));
  return sorted.slice(Math.max(0,index-radius),Math.min(sorted.length,index+radius));
}

export function rankingHistogram(candidates,field='final',bins=10){
  const vals=(candidates||[]).map(x=>Number(x[field])).filter(Number.isFinite);if(!vals.length)return{labels:[],values:[],min:0,max:0};
  const min=Math.floor(Math.min(...vals)/5)*5,max=Math.ceil(Math.max(...vals)/5)*5||min+5,step=Math.max(1,(max-min)/bins),values=Array(bins).fill(0),labels=[];
  for(let i=0;i<bins;i++)labels.push(`${Math.round(min+i*step)}–${Math.round(min+(i+1)*step)}`);
  vals.forEach(v=>{const i=Math.min(bins-1,Math.max(0,Math.floor((v-min)/step)));values[i]++});return{labels,values,min,max};
}

export function finalScore({p1=0,p2=0,p3=0,p4=0,titulos=0}={}){return Number(p1||0)+Number(p2||0)+Number(p3||0)+Number(p4||0)+Number(titulos||0)}
