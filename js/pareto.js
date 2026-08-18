function parseDate(value){
  if(!value)return null;const d=new Date(`${String(value).slice(0,10)}T12:00:00`);return Number.isNaN(d.getTime())?null:d;
}
function clamp(v,min=0,max=1){return Math.max(min,Math.min(max,Number(v)||0))}

export function focusStats(timerSessions=[],days=30){
  const cutoff=new Date();cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-(Math.max(1,days)-1));
  const bySubject={},byTopic={};let seconds=0;
  for(const s of timerSessions||[]){
    const d=parseDate(s.date||s.createdAt);if(days&&d&&d<cutoff)continue;
    const sec=Math.max(0,Number(s.seconds||0));if(!sec)continue;seconds+=sec;
    if(s.subject)bySubject[s.subject]=(bySubject[s.subject]||0)+sec;
    if(s.topicId)byTopic[s.topicId]=(byTopic[s.topicId]||0)+sec;
  }
  return{seconds,bySubject,byTopic,days};
}

export function granCoverageSummary(granMap=[]){
  const counts={coberto:0,parcial:0,lacuna:0,divergencia:0,sem_mapeamento:0};
  for(const x of granMap||[])counts[x.status]=(counts[x.status]||0)+1;
  const total=(granMap||[]).length||1;
  return{...counts,total,coveredRatio:(counts.coberto||0)/total,attentionRatio:((counts.parcial||0)+(counts.lacuna||0)+(counts.divergencia||0)+(counts.sem_mapeamento||0))/total};
}

export function reviewAdvice({topic,performance=null,gran=null,focusSeconds=0}={}){
  const q=Number(performance?.questions||0),err=Number(performance?.errorRate||0),acc=q?1-err:null;
  let minutes=15,level='Revisão diagnóstica',steps=[];
  if(q>=5&&err>=.4){minutes=30;level='Revisão corretiva';steps=['Feche o material e explique o conceito em voz alta por 3–5 min.','Abra seu erro mais recorrente e escreva por que a alternativa estava errada.','Revise somente a teoria necessária para corrigir a causa do erro.','Resolva 10–15 itens C/E do mesmo tópico; se ficar abaixo de 80%, mantenha o tópico na fila.'];}
  else if(q>=5&&err>=.2){minutes=22;level='Revisão ativa';steps=['Faça recuperação ativa sem consulta por 3 min.','Confira definição, exceções e pegadinhas que você esqueceu.','Refaça 5–10 questões C/E e registre apenas os erros conceituais.'];}
  else if(q>=5){minutes=14;level='Revisão de manutenção';steps=['Faça um resumo oral de 2–3 min sem olhar anotações.','Confira pontos-chave e exceções.','Resolva 5 itens C/E para validar retenção.'];}
  else{steps=['Leia o item do edital e tente listar o que você sabe sem consultar.','Estude a aula/teoria vinculada por 10–15 min.','Resolva ao menos 10 itens C/E para criar uma primeira amostra.'];}
  if(gran?.status==='lacuna')steps.splice(1,0,'O Gran não cobre integralmente este ponto: use material complementar antes das questões.');
  if(gran?.status==='parcial')steps.splice(1,0,'Use as aulas do Gran apenas para a parte coberta e complemente a lacuna indicada.');
  if(gran?.status==='divergencia')steps.splice(1,0,'Há divergência entre a declaração de cobertura do Gran e a grade encontrada; confira a aula e mantenha material complementar como segurança.');
  if(focusSeconds>0&&focusSeconds<600)steps.push('Seu tempo acumulado neste tópico ainda é baixo; faça pelo menos mais 10 min de estudo ativo.');
  return{level,minutes,accuracy:acc,steps};
}

export function buildParetoPlan({edital=[],granMap=[],priorityData={},state={},topicRows=[],subjectRows=[],totalMinutes=0,dueReviews=[],weights={},questionGoal=100}={}){
  const objective=edital.filter(x=>x.prova==='P1'||x.prova==='P2');
  const topicPerf=Object.fromEntries((topicRows||[]).map(x=>[x.topicId,x]));
  const subjectPerf=Object.fromEntries((subjectRows||[]).map(x=>[x.subject,x]));
  const granBy=Object.fromEntries((granMap||[]).map(x=>[x.editalId,x]));
  const histBy=Object.fromEntries((priorityData.topics||[]).map(x=>[x.editalId,x]));
  const focus=focusStats(state.timerSessions||[],30),objectiveFocusTotal=Object.keys(weights||{}).reduce((a,k)=>a+Number(focus.bySubject[k]||0),0)||1;
  const dueSet=new Set((dueReviews||[]).filter(x=>x.type==='edital').map(x=>x.itemId));
  const maxWeight=Math.max(1,...objective.map(x=>Number(x.pesoTopico||0)));
  const formula={officialWeight:.45,historicalOverlap:.15,userWeakness:.20,unfinished:.08,granCoverageRisk:.05,focusDeficit:.05,reviewDue:.02,...(priorityData.formula||{})};
  const examTotal=Object.values(weights||{}).reduce((a,b)=>a+Number(b||0),0)||120;
  const rows=objective.map(topic=>{
    const perf=topicPerf[topic.id],sub=subjectPerf[topic.materia],q=Number(perf?.questions||0),confidence=clamp(q/30),subjectQ=Number(sub?.questions||0),subjectConf=clamp(subjectQ/80);
    const weakness=q?Number(perf.errorRate||0)*(.55+.45*confidence):Number(sub?.errorRate||0)*.45*subjectConf;
    const historical=Number(histBy[topic.id]?.historicalOverlap||.2),done=Boolean(state.edital?.[topic.id]?.done),gran=granBy[topic.id]||{status:'sem_mapeamento',lessonIds:[],lessons:[]};
    const risk=({coberto:0,parcial:.55,lacuna:1,divergencia:.7,sem_mapeamento:.85})[gran.status]??.4;
    const expected=(Number(weights?.[topic.materia]||0)/examTotal),actual=(Number(focus.bySubject[topic.materia]||0)/objectiveFocusTotal),focusDeficit=expected?clamp((expected-actual)/expected):0;
    const factors={officialWeight:Number(topic.pesoTopico||0)/maxWeight,historicalOverlap:historical,userWeakness:clamp(weakness),unfinished:done?.15:1,granCoverageRisk:risk,focusDeficit,reviewDue:dueSet.has(topic.id)?1:0};
    const score=Object.entries(formula).reduce((sum,[k,w])=>sum+Number(w||0)*Number(factors[k]||0),0);
    return{topicId:topic.id,prova:topic.prova,subject:topic.materia,item:topic.item,label:topic.conteudo,topicWeight:Number(topic.pesoTopico||0),score,factors,questions:q,correct:Number(perf?.correct||0),errors:Number(perf?.errors||0),errorRate:Number(perf?.errorRate||0),focusSeconds:Number(focus.byTopic[topic.id]||0),gran,done,historicalFamilies:histBy[topic.id]?.families||[]};
  }).sort((a,b)=>b.score-a.score||b.topicWeight-a.topicWeight);
  const coreCount=Math.max(1,Math.ceil(rows.length*Number(priorityData.coreTopicFraction||.20))),core=rows.slice(0,coreCount),rest=rows.slice(coreCount);
  const coreMinutes=Math.round(Math.max(0,totalMinutes)*Number(priorityData.coreTimeFraction||.80)),maintenanceMinutes=Math.max(0,Math.round(totalMinutes)-coreMinutes);
  const distribute=(list,minutes,qGoal)=>{
    const denom=list.reduce((a,x)=>a+Math.max(.01,x.score),0)||1;
    const qDenom=denom;
    return list.map(x=>({...x,weeklyMinutes:minutes*(Math.max(.01,x.score)/denom),questionTarget:Math.max(0,Math.round(qGoal*(Math.max(.01,x.score)/qDenom)))}));
  };
  const coreRows=distribute(core,coreMinutes,Math.round(questionGoal*.8));
  // manutenção: no máximo 12 tópicos, privilegiando o restante ainda não concluído e com maior score
  const maintenanceBase=rest.filter(x=>!x.done||x.questions<10).slice(0,12);
  const maintenance=distribute(maintenanceBase,maintenanceMinutes,Math.max(0,questionGoal-Math.round(questionGoal*.8)));
  const subjectMinutes={};for(const x of [...coreRows,...maintenance])subjectMinutes[x.subject]=(subjectMinutes[x.subject]||0)+x.weeklyMinutes;
  const priorityLessonIds=[];for(const x of coreRows)for(const id of x.gran?.lessonIds||[])if(!priorityLessonIds.includes(id))priorityLessonIds.push(id);
  return{generatedAt:new Date().toISOString(),coreCount,totalTopics:rows.length,coreMinutes,maintenanceMinutes,core:coreRows,maintenance,all:rows,subjectMinutes,priorityLessonIds,focus,formula};
}
