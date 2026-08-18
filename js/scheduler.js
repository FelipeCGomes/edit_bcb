export function localDateISO(date=new Date()){
  const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date=new Date()){
  const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const shift=(d.getDay()+6)%7; // segunda = 0
  d.setDate(d.getDate()-shift);
  d.setHours(0,0,0,0);
  return d;
}

export function weekKey(date=new Date()){return localDateISO(startOfWeek(date));}

export function dateFromWeekDay(weekStart,jsDay){
  const d=new Date(weekStart),offset=jsDay===0?6:jsDay-1;
  d.setDate(d.getDate()+offset);return d;
}

export function parseTimeOfDay(value='19:00'){
  const m=String(value||'').match(/^(\d{1,2}):([0-5]\d)$/);if(!m)return 19*60;
  return Math.min(23,Number(m[1]))*60+Number(m[2]);
}

export function formatTimeOfDay(totalMinutes=0){
  totalMinutes=Math.round(Number(totalMinutes)||0);const day=Math.floor(totalMinutes/1440),within=((totalMinutes%1440)+1440)%1440;
  const h=Math.floor(within/60),m=within%60;return `${day?`+${day}d `:''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function parseLocalDate(value){if(!value)return null;const [y,m,d]=String(value).split('-').map(Number);if(!y||!m||!d)return null;return new Date(y,m-1,d,12,0,0,0)}
function diffDays(from,to){return Math.floor((to-from)/86400000)}
function eventId(prefix,date,index){return `${prefix}-${date}-${String(index+1).padStart(2,'0')}`}

function chooseCandidate(pools,targets,planned,allocMap,remainingWindow,breakMinutes,hasPrevious,examTotalWeight=120,priorityLessonIds=new Set()){
  const candidates=[];
  for(const [subject,pool] of Object.entries(pools)){
    if(!pool.length)continue;const lesson=pool[0],duration=Math.max(1,Math.ceil(Number(lesson.duracaoSegundos||0)/60));if(!lesson.duracaoSegundos)continue;
    const need=duration+(hasPrevious?breakMinutes:0);if(need>remainingWindow)continue;
    const target=Math.max(1,Number(targets[subject]||0)),deficit=target-Number(planned[subject]||0),deficitRatio=deficit/target,share=Number(allocMap[subject]?.share||0),exam=Number(allocMap[subject]?.items||0)/Math.max(1,Number(examTotalWeight||120));
    const paretoBonus=priorityLessonIds?.has?.(lesson.id)?2.5:0;candidates.push({subject,lesson,duration,need,score:deficitRatio*4+share*2+exam+paretoBonus});
  }
  candidates.sort((a,b)=>b.score-a.score||a.lesson._sourceIndex-b.lesson._sourceIndex);return candidates[0]||null;
}

function sprintActiveForDate(dateISO,examDate,finalSprint){
  const exam=parseLocalDate(examDate),date=parseLocalDate(dateISO);if(!exam||!date)return false;
  const left=diffDays(date,exam),days=Math.max(1,Number(finalSprint?.days||15));return left>=0&&left<days;
}

function weakTarget(weakTopics,index,allocations){
  if(weakTopics?.length)return weakTopics[index%weakTopics.length];
  const fallback=(allocations||[]).filter(x=>x.remaining>0).sort((a,b)=>b.items-a.items)[0];
  return fallback?{materia:fallback.materia,topicId:null,topicLabel:'Revisão geral da matéria',errors:0,errorRate:0}:null;
}

function addSprintPractice({events,dayEvents,date,day,cursor,index,totalMinutes,weakTopics,weakIndex,finalSprint,allocations}){
  if(totalMinutes<=0)return {cursor,index,weakIndex,used:0};
  const reviewRatio=Number(finalSprint?.reviewShare??.5),questionRatio=Number(finalSprint?.questionShare??.5),sum=reviewRatio+questionRatio||1;
  const reviewMinutes=Math.max(0,Math.round(totalMinutes*reviewRatio/sum)),questionMinutes=Math.max(0,totalMinutes-reviewMinutes);
  let used=0;
  for(const [kind,minutes] of [['revisao-erro',reviewMinutes],['questoes-erro',questionMinutes]]){
    if(!minutes)continue;const target=weakTarget(weakTopics,weakIndex++,allocations),subject=target?.materia||'Revisão orientada',topic=target?.topicLabel||'Assuntos com maior incidência de erros';
    const startMinute=cursor,endMinute=cursor+minutes,review=kind==='revisao-erro';
    const e={id:eventId('practice',date,index++),type:'practice',kind,date,day,subject,materia:`${review?'Revisão':'Questões'} · ${subject}`,titulo:topic,topicId:target?.topicId||null,route:review?'revisoes':'questoes',startMinute,endMinute,minutes,smart:true};
    events.push(e);dayEvents.push(e);cursor=endMinute;used+=minutes;
  }
  return {cursor,index,weakIndex,used};
}

export function buildWeeklySchedule({
  course=[],watchedIds=new Set(),reservedLessonIds=new Set(),allocations=[],dayMinutes={},dayStartTimes={},breakMinutes=5,
  saturday={},baseDate=new Date(),examDate='',finalSprint={},weakTopics=[],examTotalWeight=120,practiceLabels={},practiceRoutes={},priorityLessonIds=[]
}={}){
  const weekStart=startOfWeek(baseDate),key=weekKey(baseDate),allocMap=Object.fromEntries(allocations.map(x=>[x.materia,x])),priorityIds=new Set(priorityLessonIds||[]);
  const subjects=allocations.map(x=>x.materia),subjectSet=new Set(subjects),pools={};subjects.forEach(s=>pools[s]=[]);
  course.forEach((lesson,index)=>{if(!subjectSet.has(lesson.materia)||watchedIds.has(lesson.id)||reservedLessonIds.has(lesson.id)||!Number(lesson.duracaoSegundos||0))return;pools[lesson.materia].push({...lesson,_sourceIndex:index});});
  Object.values(pools).forEach(pool=>pool.sort((a,b)=>(priorityIds.has(b.id)?1:0)-(priorityIds.has(a.id)?1:0)||a._sourceIndex-b._sourceIndex));

  const targets=Object.fromEntries(allocations.map(x=>[x.materia,Number(x.weeklyMinutes||0)])),planned=Object.fromEntries(subjects.map(s=>[s,0]));
  const events=[],unusedByDay={},daySummary={},contentOrder=[1,2,3,4,5,0];let weakIndex=0;

  for(const day of contentOrder){
    const budget=Math.max(0,Math.round(Number(dayMinutes[day]||0))),date=localDateISO(dateFromWeekDay(weekStart,day)),start=parseTimeOfDay(dayStartTimes[day]);
    const sprint=sprintActiveForDate(date,examDate,finalSprint),practiceShare=sprint?Math.min(.9,Math.max(.5,Number(finalSprint?.practiceShare??.6))):0;
    const reservedPractice=Math.round(budget*practiceShare),contentBudget=Math.max(0,budget-reservedPractice);
    let cursor=start,windowUsed=0,index=0,studyMinutes=0,practiceMinutes=0;const dayEvents=[];
    while(windowUsed<contentBudget){
      const remaining=contentBudget-windowUsed,cand=chooseCandidate(pools,targets,planned,allocMap,remaining,Math.max(0,Number(breakMinutes||0)),dayEvents.some(e=>e.type==='lesson'),examTotalWeight,priorityIds);
      if(!cand)break;
      if(dayEvents.some(e=>e.type==='lesson')){cursor+=Math.max(0,Number(breakMinutes||0));windowUsed+=Math.max(0,Number(breakMinutes||0));}
      const startMinute=cursor,endMinute=cursor+cand.duration,e={id:eventId('lesson',date,index++),type:'lesson',date,day,lessonId:cand.lesson.id,materia:cand.lesson.materia,topico:cand.lesson.topico,numero:cand.lesson.numero,titulo:cand.lesson.titulo,professor:cand.lesson.professor,duracaoSegundos:cand.lesson.duracaoSegundos,startMinute,endMinute};
      events.push(e);dayEvents.push(e);pools[cand.subject].shift();planned[cand.subject]+=cand.duration;studyMinutes+=cand.duration;cursor=endMinute;windowUsed+=cand.duration;
    }
    if(sprint){
      const extra=Math.max(0,contentBudget-windowUsed),practiceTotal=reservedPractice+extra,res=addSprintPractice({events,dayEvents,date,day,cursor,index,totalMinutes:practiceTotal,weakTopics,weakIndex,finalSprint,allocations});
      cursor=res.cursor;index=res.index;weakIndex=res.weakIndex;practiceMinutes=res.used;windowUsed+=practiceMinutes;
    }
    unusedByDay[date]=Math.max(0,budget-windowUsed);daySummary[date]={budget,studyMinutes,practiceMinutes,unused:unusedByDay[date],events:dayEvents.length,finalSprint:sprint};
  }

  // Sábado: prática. Na reta final, revisão e questões passam a ocupar 80% por padrão.
  {
    const day=6,budget=Math.max(0,Math.round(Number(dayMinutes[day]||0))),date=localDateISO(dateFromWeekDay(weekStart,day)),start=parseTimeOfDay(dayStartTimes[day]),sprint=sprintActiveForDate(date,examDate,finalSprint);
    const labels={revisao:'Revisão da semana',questoes:'Questões direcionadas',simulado:'Simulado',discursiva:'Produção textual',...(practiceLabels||{})},routes={revisao:'revisoes',questoes:'questoes',simulado:'questoes',discursiva:'discursiva',...(practiceRoutes||{})};
    const saturdayPlan=sprint?(finalSprint?.saturday||saturday):saturday,entries=Object.entries(saturdayPlan||{});let cursor=start,used=0,index=0;
    entries.forEach(([kind,ratio],i)=>{
      const minutes=i===entries.length-1?Math.max(0,budget-used):Math.max(0,Math.round(budget*Number(ratio||0)));if(!minutes)return;
      const target=(kind==='revisao'||kind==='questoes')?weakTarget(weakTopics,weakIndex++,allocations):null,startMinute=cursor,endMinute=cursor+minutes;
      events.push({id:eventId('practice',date,index++),type:'practice',kind,date,day,subject:target?.materia||null,materia:sprint&&target&&kind==='revisao'?`Revisão · ${target.materia}`:sprint&&target&&kind==='questoes'?`Questões · ${target.materia}`:(labels[kind]||kind),titulo:target?.topicLabel||(labels[kind]||kind),topicId:target?.topicId||null,route:routes[kind]||'hoje',startMinute,endMinute,minutes,smart:Boolean(target),finalSprint:sprint});
      cursor=endMinute;used+=minutes;
    });
    unusedByDay[date]=Math.max(0,budget-used);daySummary[date]={budget,studyMinutes:0,practiceMinutes:used,unused:unusedByDay[date],events:entries.length,finalSprint:sprint};
  }

  events.sort((a,b)=>a.date.localeCompare(b.date)||a.startMinute-b.startMinute);
  return {key,weekStart:localDateISO(weekStart),generatedAt:new Date().toISOString(),events,unusedByDay,daySummary,plannedBySubject:planned,examDate,finalSprintDays:Number(finalSprint?.days||15)};
}

export function eventsForDate(plan,date){return (plan?.events||[]).filter(x=>x.date===date).sort((a,b)=>a.startMinute-b.startMinute)}
