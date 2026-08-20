import {startOfWeek,weekKey,localDateISO,dateFromWeekDay} from './scheduler.js';

function parseTime(value='19:00'){
  const m=String(value||'').match(/^(\d{1,2}):([0-5]\d)$/);if(!m)return 19*60;
  return Math.min(23,Number(m[1]))*60+Number(m[2]);
}
function jsDayFromISO(iso){const [y,m,d]=iso.split('-').map(Number);return new Date(y,m-1,d,12).getDay()}
function weekStartISO(iso){const [y,m,d]=iso.split('-').map(Number);return localDateISO(startOfWeek(new Date(y,m-1,d,12)))}
function eventId(prefix,date,index){return `${prefix}-${date}-${String(index+1).padStart(2,'0')}`}

export function fixedPlanWeek(planData,baseDate=new Date(),dayStartTimes={}){
  const targetKey=weekKey(baseDate),week=(planData?.weeks||[]).find(w=>w.days?.some(d=>weekStartISO(d.date)===targetKey));
  const events=[],unusedByDay={},daySummary={};
  if(!week)return {key:targetKey,weekStart:targetKey,generatedAt:new Date().toISOString(),events,unusedByDay,daySummary,fixed:true,week:null,phase:'Fora do cronograma'};
  for(const day of week.days||[]){
    const jsDay=jsDayFromISO(day.date),start=parseTime(dayStartTimes?.[jsDay]|| (jsDay===6?'09:00':'19:00'));
    let cursor=start,index=0,studyMinutes=0,practiceMinutes=0;const dayEvents=[];
    const objectiveLessons=(day.tasks||[]).filter(t=>t.type==='lesson'&&['P1','P2'].includes(t.proof));
    const uniqueSubjects=[...new Set(objectiveLessons.map(t=>t.subject))];
    for(const task of day.tasks||[]){
      const minutes=Math.max(1,Number(task.minutes||0)),startMinute=cursor,endMinute=cursor+minutes;
      let e;
      if(task.type==='lesson'){
        e={id:eventId('fixed-lesson',day.date,index++),type:'lesson',date:day.date,day:jsDay,lessonId:task.lessonId,materia:task.subject,topico:task.topic,numero:task.number,titulo:task.title,professor:task.professor,duracaoSegundos:Number(task.durationSeconds||minutes*60),plannedMinutes:minutes,startMinute,endMinute,fixed:true,proof:task.proof||null};
        studyMinutes+=minutes;
      }else if(task.type==='complement'){
        e={id:eventId('fixed-complement',day.date,index++),type:'practice',kind:'complemento',date:day.date,day:jsDay,subject:task.subject,materia:`COMPLEMENTO DO EDITAL · ${task.subject}`,titulo:task.title,topicId:task.topicId||null,route:'edital',startMinute,endMinute,minutes,fixed:true,complement:true};
        practiceMinutes+=minutes;
      }else{
        const subject=uniqueSubjects.length===1?uniqueSubjects[0]:null;
        e={id:eventId(`fixed-${task.kind||'practice'}`,day.date,index++),type:'practice',kind:task.kind||'practice',date:day.date,day:jsDay,subject,materia:task.title||'Prática',titulo:task.note||task.title||'Prática',topicId:null,route:task.route||'hoje',startMinute,endMinute,minutes,fixed:true};
        practiceMinutes+=minutes;
      }
      events.push(e);dayEvents.push(e);cursor=endMinute;
    }
    const budget=dayEvents.reduce((n,e)=>n+(e.endMinute-e.startMinute),0);
    daySummary[day.date]={budget,studyMinutes,practiceMinutes,unused:0,events:dayEvents.length,fixed:true,phase:week.phase};unusedByDay[day.date]=0;
  }
  events.sort((a,b)=>a.date.localeCompare(b.date)||a.startMinute-b.startMinute);
  return {key:targetKey,weekStart:targetKey,generatedAt:new Date().toISOString(),events,unusedByDay,daySummary,fixed:true,week:week.week,phase:week.phase,focus:week.focus||''};
}

export function fixedPlanDay(planData,dateISO){
  for(const week of planData?.weeks||[]){const day=(week.days||[]).find(d=>d.date===dateISO);if(day)return{...day,week:week.week,phase:week.phase,focus:week.focus||''}}
  return null;
}

export function fixedPlanProgress(planData,dateISO=localDateISO(new Date())){
  const days=(planData?.weeks||[]).flatMap(w=>(w.days||[]).map(d=>({...d,week:w.week,phase:w.phase}))).sort((a,b)=>a.date.localeCompare(b.date));
  const current=days.find(d=>d.date===dateISO)||days.find(d=>d.date>dateISO)||null;
  const elapsed=days.filter(d=>d.date<dateISO).length;
  return{days,current,elapsed,total:days.length,ratio:days.length?Math.min(1,elapsed/days.length):0};
}
