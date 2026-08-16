import fs from 'fs';
import {buildWeeklySchedule} from '../js/scheduler.js';

const course=JSON.parse(fs.readFileSync(new URL('../data/curso-gran.json',import.meta.url),'utf8'));
const weights=JSON.parse(fs.readFileSync(new URL('../data/pesos.json',import.meta.url),'utf8'));
const allocations=Object.keys(weights).map(materia=>({materia,items:weights[materia],remaining:1,share:weights[materia]/120,weeklyMinutes:60}));
const dayMinutes={0:90,1:90,2:90,3:90,4:90,5:90,6:180};
const dayStartTimes={0:'09:00',1:'19:00',2:'19:00',3:'19:00',4:'19:00',5:'19:00',6:'09:00'};
const finalSprint={days:15,practiceShare:.6,reviewShare:.5,questionShare:.5,saturday:{revisao:.4,questoes:.4,simulado:.15,discursiva:.05}};
const weakTopics=[{materia:'Engenharia de Software',topicId:'edital-001',topicLabel:'Microsserviços',errors:12,errorRate:.6}];

const sprint=buildWeeklySchedule({course,allocations,dayMinutes,dayStartTimes,breakMinutes:5,saturday:{revisao:.3,questoes:.3,simulado:.25,discursiva:.15},baseDate:new Date(2026,7,17),examDate:'2026-08-27',finalSprint,weakTopics});
const lessonIds=sprint.events.filter(e=>e.type==='lesson').map(e=>e.lessonId);
if(new Set(lessonIds).size!==lessonIds.length)throw new Error('A mesma aula foi agendada mais de uma vez.');
const smart=sprint.events.filter(e=>e.type==='practice'&&e.day!==6);
if(!smart.some(e=>e.kind==='revisao-erro')||!smart.some(e=>e.kind==='questoes-erro'))throw new Error('Reta final não gerou revisão e questões inteligentes.');
const saturday=sprint.events.filter(e=>e.day===6&&e.type==='practice');
if(saturday.reduce((a,e)=>a+e.minutes,0)!==180)throw new Error('O sábado não respeitou a duração disponível.');

const regular=buildWeeklySchedule({course,allocations,dayMinutes,dayStartTimes,breakMinutes:5,saturday:{revisao:.3,questoes:.3,simulado:.25,discursiva:.15},baseDate:new Date(2026,7,17),examDate:'2026-09-30',finalSprint,weakTopics});
if(regular.events.some(e=>e.type==='practice'&&e.day!==6))throw new Error('Prática de reta final apareceu antes dos 15 dias.');

console.log('scheduler-smoke: OK');
