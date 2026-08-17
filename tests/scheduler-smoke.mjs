import fs from 'fs';
import {buildWeeklySchedule} from '../js/scheduler.js';

function runContest(courseFile,weightsFile,totalWeight,label){
  const course=JSON.parse(fs.readFileSync(new URL(courseFile,import.meta.url),'utf8'));
  const weights=JSON.parse(fs.readFileSync(new URL(weightsFile,import.meta.url),'utf8'));
  const allocations=Object.keys(weights).map(materia=>({materia,items:weights[materia],remaining:1,share:weights[materia]/totalWeight,weeklyMinutes:60}));
  const dayMinutes={0:90,1:90,2:90,3:90,4:90,5:90,6:180};
  const dayStartTimes={0:'09:00',1:'19:00',2:'19:00',3:'19:00',4:'19:00',5:'19:00',6:'09:00'};
  const finalSprint={days:15,practiceShare:.6,reviewShare:.5,questionShare:.5,saturday:{revisao:.4,questoes:.4,simulado:.15,discursiva:.05}};
  const weakSubject=Object.keys(weights)[0],weakTopics=[{materia:weakSubject,topicId:'topic-1',topicLabel:'Tópico fraco',errors:12,errorRate:.6}];
  const sprint=buildWeeklySchedule({course,allocations,dayMinutes,dayStartTimes,breakMinutes:5,saturday:{revisao:.3,questoes:.3,simulado:.25,discursiva:.15},baseDate:new Date(2026,7,17),examDate:'2026-08-27',finalSprint,weakTopics,examTotalWeight:totalWeight});
  const lessonIds=sprint.events.filter(e=>e.type==='lesson').map(e=>e.lessonId);
  if(new Set(lessonIds).size!==lessonIds.length)throw new Error(`${label}: aula duplicada na mesma semana.`);
  const smart=sprint.events.filter(e=>e.type==='practice'&&e.day!==6);
  if(!smart.some(e=>e.kind==='revisao-erro')||!smart.some(e=>e.kind==='questoes-erro'))throw new Error(`${label}: reta final não gerou prática inteligente.`);
  const saturday=sprint.events.filter(e=>e.day===6&&e.type==='practice');
  if(saturday.reduce((a,e)=>a+e.minutes,0)!==180)throw new Error(`${label}: sábado não respeitou duração disponível.`);
}
runContest('../data/curso-gran.json','../data/pesos.json',120,'BACEN');
runContest('../data/curso-bb.json','../data/pesos-bb.json',100,'BB');
console.log('scheduler-smoke: OK');
