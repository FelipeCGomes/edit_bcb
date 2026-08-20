const loading=document.querySelector('#loading-screen');

function showStartupError(error){
  console.error('Falha ao iniciar BACEN Estudos TI:',error);
  if(!loading)return;
  const message=String(error?.message||error||'Erro desconhecido');
  loading.innerHTML=`<strong>Não foi possível iniciar o BACEN Estudos TI.</strong><small>${message}<br>Atualize a página com Ctrl+F5. Se persistir, limpe os dados do site/PWA e abra novamente.</small>`;
}

import('./app.js').catch(showStartupError);
