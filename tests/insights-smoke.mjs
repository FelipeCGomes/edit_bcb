import assert from 'node:assert/strict';
import {consistencyStats,weeklyProgress,spacedReviews,readinessScore,nextBestAction,activityDays} from '../js/insights.js';
const today=new Date(),iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const d1=new Date(today);d1.setDate(d1.getDate()-1);const d7=new Date(today);d7.setDate(d7.getDate()-7);const d30=new Date(today);d30.setDate(d30.getDate()-30);
const state={
  timerSessions:[{date:iso(today),seconds:3600},{date:iso(d1),seconds:1800}],
  questions:[{date:iso(today),questions:20,correct:16}],
  course:{c1:{watched:true,completedAt:iso(d1)},c2:{watched:true,completedAt:iso(d7)}},
  edital:{e1:{done:true,completedAt:iso(d30)}},reviewHistory:[],discursiveSessions:[]
};
const consistency=consistencyStats(state);assert.ok(consistency.current>=2,'sequência não detectada');
const weekly=weeklyProgress(state,{studyMinutes:600,questions:100},today);assert.equal(weekly.questions,20);assert.ok(weekly.studyMinutes>=60);
const reviews=spacedReviews({edital:[{id:'e1',item:'1',materia:'TI',conteudo:'Teste'}],course:[{id:'c1',materia:'TI',topico:'1',numero:'1',titulo:'Aula 1'},{id:'c2',materia:'TI',topico:'1',numero:'2',titulo:'Aula 2'}],state,today:iso(today)});assert.ok(reviews.length>=2,'revisões 1-7-30 não foram geradas');
const readiness=readinessScore({courseRatio:.5,editalRatio:.5,accuracy:.8,totalQuestions:200,consistency,weekly,accuracyGoal:.8});assert.ok(readiness.score>0&&readiness.score<=100);
const action=nextBestAction({dueReviews:reviews,weakTopics:[],todayEvents:[],course:[],state});assert.equal(action.kind,'review');
assert.equal(activityDays(state,14).length,14);
console.log('insights-smoke: OK');
