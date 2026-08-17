const PREFIX='estudos-ti-state-v6';
const LEGACY_PREFIX='estudos-ti-state-v5';
const ACTIVE_KEY='estudos-ti-active-contest';

function contestKey(contest='bacen'){return `${PREFIX}-${contest}`}
function legacyContestKey(contest='bacen'){return `${LEGACY_PREFIX}-${contest}`}
function todayLocal(){
  const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

export function createDefaultState(config={}){
  const weeklyStudy=Object.values(config.dias||{}).reduce((a,x)=>a+Number(x||0),0);
  return {
    schema:6,createdAt:new Date().toISOString(),lastVisit:null,
    edital:{},course:{},questions:[],timerSessions:[],weeklyChecks:{},discursiveSessions:[],weeklyPlans:{},lessonLinks:{},reviewHistory:[],
    discursiva:{pairId:null,atualidadeId:null,tiId:null,history:[]},
    rankingSimulation:{filter:'all',useAuto:true,p1:null,p2:null,p3:0,p4:0,titulos:0},
    settings:{
      theme:'dark',dayMinutes:{...config.dias},dayStartTimes:{...config.horariosInicio},breakMinutes:Number(config.intervaloMinutos??5),
      loadWeight:Number(config.pesoCarga??.5),examWeight:Number(config.pesoProva??.5),saturday:{...config.sabado},cycle:[...(config.ciclo||[])],
      preparationMode:config.modoPreparacao||'pre',studyStartDate:config.dataInicioEstudos||todayLocal(),editalDate:config.dataEdital||'',
      objectiveExamDate:config.dataProvaObjetiva||config.dataAlvo||'',targetDate:config.dataAlvo||'',autoPriority:config.prioridadeAutomatica!==false,
      finalSprint:{days:15,practiceShare:.60,reviewShare:.50,questionShare:.50,...(config.retaFinal||{}),saturday:{revisao:.40,questoes:.40,simulado:.15,discursiva:.05,...(config.retaFinal?.sabado||config.retaFinal?.saturday||{})}},
      notifications:{enabled:false,inactivityHours:24,...(config.notificacoes||{})},
      goals:{studyMinutes:weeklyStudy,questions:100,accuracy:.80,...(config.metas||{})},
      coursePageSize:40,editalPageSize:30
    }
  };
}

function mergeState(saved,config={}){
  const d=createDefaultState(config),s=saved||{};
  const merged={...d,...s,schema:6,
    weeklyPlans:{...d.weeklyPlans,...(s.weeklyPlans||{})},lessonLinks:{...d.lessonLinks,...(s.lessonLinks||{})},discursiva:{...d.discursiva,...(s.discursiva||{})},rankingSimulation:{...d.rankingSimulation,...(s.rankingSimulation||{})},
    settings:{...d.settings,...(s.settings||{}),dayMinutes:{...d.settings.dayMinutes,...(s.settings?.dayMinutes||{})},dayStartTimes:{...d.settings.dayStartTimes,...(s.settings?.dayStartTimes||{})},
      saturday:{...d.settings.saturday,...(s.settings?.saturday||{})},finalSprint:{...d.settings.finalSprint,...(s.settings?.finalSprint||{}),saturday:{...d.settings.finalSprint.saturday,...(s.settings?.finalSprint?.saturday||{})}},
      notifications:{...d.settings.notifications,...(s.settings?.notifications||{})},goals:{...d.settings.goals,...(s.settings?.goals||{})}}
  };
  if(!Array.isArray(merged.discursiveSessions))merged.discursiveSessions=[];
  if(!Array.isArray(merged.questions))merged.questions=[];
  if(!Array.isArray(merged.reviewHistory))merged.reviewHistory=[];
  if(!merged.settings.studyStartDate)merged.settings.studyStartDate=todayLocal();
  if(!merged.settings.preparationMode)merged.settings.preparationMode='pre';
  if(!merged.settings.objectiveExamDate&&merged.settings.targetDate)merged.settings.objectiveExamDate=merged.settings.targetDate;
  merged.settings.targetDate=merged.settings.objectiveExamDate||merged.settings.targetDate||'';
  return merged;
}

export function loadState(config={},contest='bacen'){
  try{
    let raw=localStorage.getItem(contestKey(contest));
    if(!raw)raw=localStorage.getItem(legacyContestKey(contest));
    // Migração transparente: todo o progresso das versões BACEN anteriores entra no perfil BACEN.
    if(!raw&&contest==='bacen') raw=localStorage.getItem('bacen-ti-state-v4')||localStorage.getItem('bacen-ti-state-v3')||localStorage.getItem('bacen-ti-state-v2')||localStorage.getItem('bacen-ti-state-v1');
    const merged=mergeState(raw?JSON.parse(raw):null,config);localStorage.setItem(contestKey(contest),JSON.stringify(merged));return merged;
  }catch{return createDefaultState(config)}
}
export function saveState(state,contest='bacen'){localStorage.setItem(contestKey(contest),JSON.stringify(state));}
export function resetState(config={},contest='bacen'){const s=createDefaultState(config);saveState(s,contest);return s}
export function storageKey(contest='bacen'){return contestKey(contest)}
export function getActiveContest(fallback='bacen'){return localStorage.getItem(ACTIVE_KEY)||fallback}
export function setActiveContest(contest){localStorage.setItem(ACTIVE_KEY,contest)}
