export function clampNumber(value,min,max){
  const n=Number(value);if(!Number.isFinite(n))return min;return Math.min(max,Math.max(min,n));
}

export function cebraspeExpectedScore(items,accuracy){
  const n=Math.max(0,Number(items)||0),p=clampNumber(accuracy,0,1);
  return n*(1.5*p-.5);
}

export function cebraspePracticeScore(correct,errors){
  return Math.max(0,Number(correct)||0)-Math.max(0,Number(errors)||0)*.5;
}

function confidenceLabel(questions,coverage){
  const q=Number(questions||0),c=Number(coverage||0);
  if(q>=300&&c>=.8)return'Amostra robusta';
  if(q>=150&&c>=.6)return'Amostra boa';
  if(q>=60&&c>=.35)return'Amostra moderada';
  if(q>0)return'Amostra inicial';
  return'Sem amostra';
}

/**
 * Projeta P1/P2 usando a taxa de acerto por tema do edital e o peso oficial
 * de cada tema (pesoTopico). Temas ainda sem questões são extrapolados pela
 * média ponderada dos temas já praticados do mesmo bloco. Isso impede que um
 * único tema com muitas questões domine a projeção.
 */
export function thematicBlockProjection({topicRows=[],subjectRows=[],edital=[],subjects=[],items=0}={}){
  const subjectSet=new Set(subjects||[]),topicsById=new Map((topicRows||[]).map(x=>[x.topicId,x]));
  const subjectMap=new Map((subjectRows||[]).map(x=>[x.subject,x]));
  const defs=(edital||[]).filter(x=>subjectSet.has(x.materia)&&Number(x.pesoTopico||0)>0);
  const sampled=defs.filter(x=>(topicsById.get(x.id)?.questions||0)>0),sampledWeight=sampled.reduce((a,x)=>a+Number(x.pesoTopico||0),0);
  const blockDirectAccuracy=sampledWeight?sampled.reduce((a,x)=>a+Number(x.pesoTopico||0)*Number(topicsById.get(x.id).accuracy||0),0)/sampledWeight:null;

  const subjectFallback={};
  for(const subject of subjects||[]){
    const subjectDefs=defs.filter(x=>x.materia===subject),sampledDefs=subjectDefs.filter(x=>(topicsById.get(x.id)?.questions||0)>0),directWeight=sampledDefs.reduce((a,x)=>a+Number(x.pesoTopico||0),0);
    const directAccuracy=directWeight?sampledDefs.reduce((a,x)=>a+Number(x.pesoTopico||0)*Number(topicsById.get(x.id).accuracy||0),0)/directWeight:null;
    const themedQuestions=sampledDefs.reduce((a,x)=>a+Number(topicsById.get(x.id)?.questions||0),0),themedCorrect=sampledDefs.reduce((a,x)=>a+Number(topicsById.get(x.id)?.correct||0),0),total=subjectMap.get(subject);
    const generalQuestions=Math.max(0,Number(total?.questions||0)-themedQuestions),generalCorrect=Math.max(0,Number(total?.correct||0)-themedCorrect),generalAccuracy=generalQuestions?generalCorrect/generalQuestions:null;
    subjectFallback[subject]={directAccuracy,generalAccuracy,generalQuestions,generalCorrect};
  }
  let globalFallback=blockDirectAccuracy;
  if(globalFallback===null){const rows=[...subjectMap.values()].filter(x=>subjectSet.has(x.subject)&&x.questions>0),q=rows.reduce((a,x)=>a+x.questions,0),c=rows.reduce((a,x)=>a+x.correct,0);globalFallback=q?c/q:null}

  const topicDetails=defs.map(def=>{
    const row=topicsById.get(def.id),hasSample=Boolean(row?.questions),sf=subjectFallback[def.materia]||{};
    const projectionAccuracy=hasSample?Number(row.accuracy):sf.directAccuracy??sf.generalAccuracy??globalFallback;
    const source=hasSample?'tema':sf.directAccuracy!==null&&sf.directAccuracy!==undefined?'materia-tematica':sf.generalAccuracy!==null&&sf.generalAccuracy!==undefined?'materia-geral':projectionAccuracy===null?'sem-amostra':'bloco';
    const weight=Number(def.pesoTopico||0),projectedScore=projectionAccuracy===null?null:cebraspeExpectedScore(weight,projectionAccuracy);
    return{topicId:def.id,subject:def.materia,item:def.item,label:def.conteudo,weight,hasSample,questions:Number(row?.questions||0),correct:Number(row?.correct||0),errors:Number(row?.errors||0),accuracy:hasSample?Number(row.accuracy):null,practiceScore:cebraspePracticeScore(row?.correct||0,row?.errors||0),projectedScore,projectionAccuracy,source};
  });

  const subjectDetails=(subjects||[]).map(subject=>{
    const rows=topicDetails.filter(x=>x.subject===subject),weight=rows.reduce((a,x)=>a+x.weight,0),directWeight=rows.filter(x=>x.hasSample).reduce((a,x)=>a+x.weight,0),projectedScore=rows.reduce((a,x)=>a+Number(x.projectedScore||0),0),q=rows.reduce((a,x)=>a+x.questions,0),c=rows.reduce((a,x)=>a+x.correct,0),e=rows.reduce((a,x)=>a+x.errors,0),sf=subjectFallback[subject]||{};
    return{subject,weight,directWeight,coverage:weight?directWeight/weight:0,questions:q,generalQuestions:Number(sf.generalQuestions||0),generalCorrect:Number(sf.generalCorrect||0),correct:c,errors:e,accuracy:sf.directAccuracy??sf.generalAccuracy??null,practiceScore:cebraspePracticeScore(c,e),projectedScore,topics:rows};
  });

  const totalItems=Number(items||defs.reduce((a,x)=>a+Number(x.pesoTopico||0),0)),score=globalFallback===null?null:topicDetails.reduce((a,x)=>a+Number(x.projectedScore||0),0),questions=topicDetails.reduce((a,x)=>a+x.questions,0),correct=topicDetails.reduce((a,x)=>a+x.correct,0),errors=topicDetails.reduce((a,x)=>a+x.errors,0),coverage=totalItems?sampledWeight/totalItems:0;
  return{questions,correct,errors,accuracy:globalFallback,score,practiceScore:cebraspePracticeScore(correct,errors),coverage,confidence:confidenceLabel(questions,coverage),topics:topicDetails,subjects:subjectDetails};
}
export function discursiveProjection(sessions=[],field,maxScore=0,limit=5){
  const rows=(sessions||[]).filter(x=>x?.[field]!==null&&x?.[field]!==undefined&&x?.[field]!==''&&Number.isFinite(Number(x[field]))).slice().sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||''))).slice(0,limit);
  if(!rows.length)return{score:null,count:0,average:null,last:null,max:Number(maxScore||0)};
  const average=rows.reduce((a,x)=>a+Number(x[field]),0)/rows.length;
  return{score:average,count:rows.length,average,last:Number(rows[0][field]),max:Number(maxScore||0)};
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
