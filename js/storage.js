const KEY='bacen-ti-state-v4';

function todayLocal(){
  const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

export function createDefaultState(config={}){
  return {
    schema:4,
    createdAt:new Date().toISOString(),
    lastVisit:null,
    edital:{},course:{},questions:[],timerSessions:[],weeklyChecks:{},discursiveSessions:[],weeklyPlans:{},lessonLinks:{},
    discursiva:{pairId:null,atualidadeId:null,tiId:null,history:[]},
    settings:{
      theme:'dark',
      dayMinutes:{...config.dias},
      dayStartTimes:{...config.horariosInicio},
      breakMinutes:Number(config.intervaloMinutos??5),
      loadWeight:Number(config.pesoCarga??.5),
      examWeight:Number(config.pesoProva??.5),
      saturday:{...config.sabado},
      cycle:[...(config.ciclo||[])],
      preparationMode:config.modoPreparacao||'pre',
      studyStartDate:config.dataInicioEstudos||todayLocal(),
      editalDate:config.dataEdital||'',
      objectiveExamDate:config.dataProvaObjetiva||config.dataAlvo||'',
      targetDate:config.dataAlvo||'',
      autoPriority:config.prioridadeAutomatica!==false,
      finalSprint:{
        days:15,
        practiceShare:.60,
        reviewShare:.50,
        questionShare:.50,
        saturday:{revisao:.40,questoes:.40,simulado:.15,discursiva:.05},
        ...(config.retaFinal||{}),
        saturday:{revisao:.40,questoes:.40,simulado:.15,discursiva:.05,...(config.retaFinal?.sabado||config.retaFinal?.saturday||{})}
      },
      notifications:{enabled:false,inactivityHours:24,...(config.notificacoes||{})},
      coursePageSize:40,
      editalPageSize:30
    }
  }
}

export function loadState(config={}){
  try{
    const raw=localStorage.getItem(KEY)||localStorage.getItem('bacen-ti-state-v3')||localStorage.getItem('bacen-ti-state-v2')||localStorage.getItem('bacen-ti-state-v1');
    if(!raw)return createDefaultState(config);
    const s=JSON.parse(raw),d=createDefaultState(config);
    const merged={...d,...s,
      schema:4,
      weeklyPlans:{...d.weeklyPlans,...(s.weeklyPlans||{})},
      lessonLinks:{...d.lessonLinks,...(s.lessonLinks||{})},
      discursiva:{...d.discursiva,...(s.discursiva||{})},
      settings:{...d.settings,...(s.settings||{}),
        dayMinutes:{...d.settings.dayMinutes,...(s.settings?.dayMinutes||{})},
        dayStartTimes:{...d.settings.dayStartTimes,...(s.settings?.dayStartTimes||{})},
        saturday:{...d.settings.saturday,...(s.settings?.saturday||{})},
        finalSprint:{...d.settings.finalSprint,...(s.settings?.finalSprint||{}),saturday:{...d.settings.finalSprint.saturday,...(s.settings?.finalSprint?.saturday||{})}},
        notifications:{...d.settings.notifications,...(s.settings?.notifications||{})}
      }
    };
    if(!merged.discursiveSessions)merged.discursiveSessions=[];
    if(!Array.isArray(merged.questions))merged.questions=[];
    if(!merged.settings.studyStartDate)merged.settings.studyStartDate=todayLocal();
    if(!merged.settings.preparationMode)merged.settings.preparationMode='pre';
    if(!merged.settings.objectiveExamDate&&merged.settings.targetDate)merged.settings.objectiveExamDate=merged.settings.targetDate;
    merged.settings.targetDate=merged.settings.objectiveExamDate||merged.settings.targetDate||'';
    localStorage.setItem(KEY,JSON.stringify(merged));
    return merged;
  }catch{return createDefaultState(config)}
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function resetState(config={}){const s=createDefaultState(config);saveState(s);return s}
export function storageKey(){return KEY}
