import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const json=f=>JSON.parse(read(f));
const html=read('index.html'),css=read('css/style.css'),app=read('js/app.js'),sw=read('service-worker.js'),manifest=json('manifest.webmanifest'),registry=json('data/concursos.json'),ranking=json('data/bacen-ranking-2024.json');

assert.equal(html.includes('id="bottom-nav"'),false,'barra inferior ainda existe');
assert.ok(html.includes('data-contest="bacen"')&&html.includes('data-contest="bb"'),'seletor de concurso ausente');
assert.ok(html.includes('class="menu-svg"'),'ícone SVG do menu mobile ausente');
assert.ok(css.includes('.menu-svg')&&css.includes('stroke:currentColor'),'SVG do menu não possui stroke explícito');
assert.ok(css.includes('.contest-switcher')&&css.includes('.contest-current'),'estilos do seletor de concurso ausentes');
assert.ok(css.includes('.ranking-shell')||css.includes('.ranking-'),'estilos do ranking ausentes');
assert.ok(html.includes('id="sidebar-backdrop"')&&html.includes('id="sidebar-close"'),'drawer mobile incompleto');
assert.ok(css.includes('@media(max-width:820px)')&&css.includes('@media(max-width:520px)'),'breakpoints mobile ausentes');
assert.ok(css.includes('prefers-reduced-motion'),'acessibilidade de movimento reduzido ausente');
assert.equal(registry.version,'2.0.0');
assert.equal(registry.updatedAt,'2026-08-17');
assert.ok(registry.contests.bacen&&registry.contests.bb,'registro dos dois concursos incompleto');
assert.ok(sw.includes('./data/edital-bb.json')&&sw.includes('./data/curso-bb.json'),'PWA não inclui dados do BB');
assert.ok(html.includes('id="nav-ranking"'),'rota Meu Ranking ausente');
assert.ok(app.includes('renderRanking')&&app.includes('rankingAutomaticProjection'),'motor de ranking ausente');
assert.ok(sw.includes('./data/bacen-ranking-2024.json')&&sw.includes('./js/ranking.js'),'PWA não inclui ranking');
assert.ok(sw.includes('./js/insights.js'),'PWA não inclui motor de insights 2.0');
assert.ok(html.includes('id="global-search-button"')&&html.includes('id="command-dialog"'),'busca global 2.0 ausente');
assert.ok(html.includes('data-route="desempenho"'),'rota Desempenho 2.0 ausente');
assert.ok(app.includes('renderPerformance')&&app.includes('studyInsights')&&app.includes('spacedReviews'),'motor de desempenho 2.0 ausente');
assert.ok(sw.includes('REMINDER_CONFIG')&&sw.includes('periodicsync'),'notificações periódicas foram removidas');
assert.equal(ranking.candidatos.length,150,'ranking BACEN incompleto');
assert.equal(ranking.meta.anonimizado,true,'ranking BACEN não está anonimizado');
assert.equal(manifest.short_name,'Estudos TI');

for(const [id,editalFile,pesosFile,metaFile] of [
  ['bacen','data/edital.json','data/pesos.json','data/metadata.json'],
  ['bb','data/edital-bb.json','data/pesos-bb.json','data/metadata-bb.json']
]){
  const edital=json(editalFile),pesos=json(pesosFile),meta=json(metaFile);
  assert.equal(meta.version,'2.0.0',`${id}: versão incorreta`);
  const subjects=new Set(edital.map(x=>x.materia));
  for(const subject of Object.keys(pesos))assert.ok(subjects.has(subject),`${id}: matéria objetiva ausente no edital: ${subject}`);
}
assert.equal(json('data/curso-gran.json').length,916,'BACEN: quantidade de aulas inesperada');
assert.equal(json('data/curso-bb.json').length,850,'BB: quantidade de aulas inesperada');
assert.equal(json('data/frases-motivacionais.json').length,500,'base de frases incompleta');
assert.equal(json('data/temas-discursiva.json').length,100,'base discursiva BACEN incompleta');
assert.equal(json('data/temas-redacao-bb.json').length,100,'base de redação BB incompleta');
assert.ok(app.includes('switchContest')&&app.includes('activeContest'),'motor multi-concurso ausente');
console.log('ui-static: OK');
