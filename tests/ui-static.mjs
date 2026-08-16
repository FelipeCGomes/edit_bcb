import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
const edital=JSON.parse(fs.readFileSync(path.join(root,'data/edital.json'),'utf8'));
const pesos=JSON.parse(fs.readFileSync(path.join(root,'data/pesos.json'),'utf8'));
const metadata=JSON.parse(fs.readFileSync(path.join(root,'data/metadata.json'),'utf8'));

assert.equal(html.includes('id="bottom-nav"'),false,'barra inferior ainda existe no HTML');
assert.equal(app.includes("$('#bottom-nav')"),false,'JS ainda referencia bottom-nav');
assert.ok(html.includes('id="sidebar-backdrop"'),'backdrop do menu lateral não existe');
assert.ok(html.includes('id="sidebar-close"'),'botão de fechar menu lateral não existe');
assert.ok(css.includes('@media(max-width:820px)'),'breakpoint principal mobile ausente');
assert.ok(css.includes('@media(max-width:520px)'),'breakpoint smartphone ausente');
assert.ok(css.includes('@media(max-width:390px)'),'breakpoint smartphone estreito ausente');
assert.ok(css.includes('prefers-reduced-motion'),'acessibilidade de movimento reduzido ausente');
assert.equal(metadata.version,'1.5.0');
assert.equal(metadata.updatedAt,'2026-08-16');

const oldName=edital.filter(x=>x.materia==='Fundamentos de Macro e Microeconomia');
assert.equal(oldName.length,0,'nomenclatura antiga de Economia ainda existe');
const objective=new Set(Object.keys(pesos));
const editorialSubjects=new Set(edital.map(x=>x.materia));
for(const subject of objective) assert.ok(editorialSubjects.has(subject),`matéria objetiva ausente no edital: ${subject}`);

console.log('ui-static: OK');
