const DAY=86400000;
const localISO=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const parseDate=value=>{if(!value)return null;const m=String(value).slice(0,10).match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12)};
const addDays=(value,days)=>{const d=parseDate(value);if(!d)return null;d.setDate(d.getDate()+Number(days||0));return localISO(d)};
const startOfWeek=(date=new Date())=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12),shift=(d.getDay()+6)%7;d.setDate(d.getDate()-shift);return d};
const between=(value,min,max)=>{const d=parseDate(value);return d&&d>=min&&d<=max};

export function activityDays(state={},days=84){
  const map=new Map(),touch=(date,points=1,type='activity')=>{const key=String(date||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return;const row=map.get(key)||{date:key,points:0,seconds:0,questions:0,lessons:0,topics:0,reviews:0,writing:0};row.points+=points;if(type==='questions')row.questions+=points;if(type==='lesson')row.lessons+=1;if(type==='topic')row.topics+=1;if(type==='review')row.reviews+=1;if(type==='writing')row.writing+=1;map.set(key,row)};
  for(const s of state.timerSessions||[]){touch(s.date,Math.max(1,Math.round(Number(s.seconds||0)/900)),'study');const row=map.get(String(s.date).slice(0,10));if(row)row.seconds+=Number(s.seconds||0)}
  for(const q of state.questions||[])touch(q.date,Number(q.questions||0),'questions');
  for(const s of Object.values(state.course||{}))if(s?.watched&&s.completedAt)touch(s.completedAt,2,'lesson');
  for(const s of Object.values(state.edital||{}))if(s?.done&&s.completedAt)touch(s.completedAt,2,'topic');
  for(const r of state.reviewHistory||[])touch(r.date,2,'review');
  for(const w of state.discursiveSessions||[])touch(w.date,3,'writing');
  const end=new Date();end.setHours(12,0,0,0);const out=[];for(let i=days-1;i>=0;i--){const d=new Date(end);d.setDate(d.getDate()-i);const key=localISO(d);out.push(map.get(key)||{date:key,points:0,seconds:0,questions:0,lessons:0,topics:0,reviews:0,writing:0})}return out;
}

export function consistencyStats(state={}){
  const days=activityDays(state,365),active=days.filter(x=>x.points>0).map(x=>x.date),set=new Set(active),today=new Date();today.setHours(12,0,0,0);
  let current=0;for(let i=0;i<365;i++){const d=new Date(today);d.setDate(d.getDate()-i);const key=localISO(d);if(set.has(key))current++;else if(i===0)continue;else break}
  let best=0,run=0,prev=null;for(const key of active.sort()){const d=parseDate(key);if(prev&&Math.round((d-prev)/DAY)===1)run++;else run=1;best=Math.max(best,run);prev=d}
  const recent30=days.slice(-30).filter(x=>x.points>0).length,recent7=days.slice(-7).filter(x=>x.points>0).length;
  return{current,best,recent30,recent7,activeTotal:active.length};
}

export function weeklyProgress(state={},goals={},now=new Date()){
  const start=startOfWeek(now),end=new Date(start);end.setDate(end.getDate()+6);end.setHours(23,59,59,999);
  const studySeconds=(state.timerSessions||[]).filter(x=>between(x.date,start,end)).reduce((a,x)=>a+Number(x.seconds||0),0);
  const questions=(state.questions||[]).filter(x=>between(x.date,start,end)).reduce((a,x)=>a+Number(x.questions||0),0);
  const correct=(state.questions||[]).filter(x=>between(x.date,start,end)).reduce((a,x)=>a+Number(x.correct||0),0);
  const lessons=Object.values(state.course||{}).filter(x=>x?.watched&&between(x.completedAt,start,end)).length;
  const reviews=(state.reviewHistory||[]).filter(x=>between(x.date,start,end)).length;
  const studyMinutes=Math.round(studySeconds/60),studyGoal=Math.max(0,Number(goals.studyMinutes||0)),questionGoal=Math.max(1,Number(goals.questions||100));
  return{start:localISO(start),end:localISO(end),studySeconds,studyMinutes,questions,correct,accuracy:questions?correct/questions:0,lessons,reviews,studyGoal,questionGoal,studyRatio:studyGoal?studyMinutes/studyGoal:0,questionRatio:questions/questionGoal};
}

export function spacedReviews({edital=[],course=[],state={},today=localISO(),stages=[1,7,30]}={}){
  const history=new Set((state.reviewHistory||[]).map(x=>`${x.type}:${x.itemId}:${x.stage}`)),out=[];
  const push=(type,item,status,label,subject,detail)=>{if(!status?.completedAt)return;for(const stage of stages){const due=addDays(status.completedAt,stage);if(!due||due>today||history.has(`${type}:${item.id}:${stage}`))continue;out.push({type,itemId:item.id,stage,due,subject,label,detail,completedAt:status.completedAt,overdue:Math.max(0,Math.round((parseDate(today)-parseDate(due))/DAY))});break}};
  for(const item of edital){const st=state.edital?.[item.id];if(st?.done)push('edital',item,st,`Item ${item.item}`,item.materia,item.conteudo)}
  for(const item of course){const st=state.course?.[item.id];if(st?.watched)push('course',item,st,`Tópico ${item.topico} · Aula ${item.numero}`,item.materia,item.titulo)}
  return out.sort((a,b)=>b.overdue-a.overdue||a.due.localeCompare(b.due)||a.subject.localeCompare(b.subject));
}

export function readinessScore({courseRatio=0,editalRatio=0,accuracy=0,totalQuestions=0,consistency={},weekly={},accuracyGoal=.8}={}){
  const course=Math.min(1,Math.max(0,Number(courseRatio||0))),edital=Math.min(1,Math.max(0,Number(editalRatio||0))),acc=Math.min(1,Math.max(0,Number(accuracy||0)));
  const qScore=Math.min(1,Math.max(0,Number(totalQuestions||0)/600)),consScore=Math.min(1,(Number(consistency.recent30||0))/20),weekScore=(Math.min(1,Number(weekly.studyRatio||0))+Math.min(1,Number(weekly.questionRatio||0)))/2;
  const accuracyNormalized=Math.min(1,acc/Math.max(.5,Number(accuracyGoal||.8)));
  const score=Math.round((course*.24+edital*.16+accuracyNormalized*.28+qScore*.12+consScore*.10+weekScore*.10)*100);
  let label='Construindo base';if(score>=85)label='Faixa competitiva';else if(score>=70)label='Boa evolução';else if(score>=50)label='Em consolidação';else if(score>=30)label='Base em formação';
  return{score,label,parts:{course,edital,accuracy:accuracyNormalized,questions:qScore,consistency:consScore,weekly:weekScore}};
}

export function nextBestAction({dueReviews=[],weakTopics=[],todayEvents=[],course=[],state={}}={}){
  if(dueReviews.length){const x=dueReviews[0];return{kind:'review',title:`Revisão ${x.stage}d · ${x.subject}`,detail:x.detail,route:'revisoes',reason:x.overdue?`${x.overdue} dia(s) em atraso`:'vence hoje'}}
  if(weakTopics.length){const x=weakTopics[0];return{kind:'questions',title:`Corrigir ponto fraco · ${x.subject}`,detail:`${x.label} · ${x.errors} erro(s) em ${x.questions} questão(ões)`,route:'questoes',subject:x.subject,topicId:x.topicId,reason:`${Math.round(x.errorRate*100)}% de erro`}}
  const event=(todayEvents||[]).find(x=>x.type==='lesson'&&!state.course?.[x.lessonId]?.watched)||(todayEvents||[]).find(x=>x.type==='practice');
  if(event)return{kind:event.type,title:event.materia||event.subject||'Próximo bloco',detail:event.titulo||'Continuar plano do dia',route:event.route||'hoje',lessonId:event.lessonId||null,reason:'planejado para hoje'};
  const lesson=(course||[]).find(x=>!state.course?.[x.id]?.watched);if(lesson)return{kind:'lesson',title:`${lesson.materia} · próxima aula`,detail:lesson.titulo,route:'curso',lessonId:lesson.id,reason:'próxima pendência do curso'};
  return{kind:'done',title:'Conteúdo principal concluído',detail:'Use o tempo para questões, simulados e revisões.',route:'questoes',reason:'manutenção'};
}

export function scoreBand(score){const n=Number(score||0);if(n>=85)return'high';if(n>=70)return'good';if(n>=50)return'mid';return'low'}
