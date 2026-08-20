import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const jsDir=path.join(root,'js');
const files=fs.readdirSync(jsDir).filter(f=>f.endsWith('.js')).sort();
for(const file of files){
  const source=fs.readFileSync(path.join(jsDir,file),'utf8');
  const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:source,encoding:'utf8'});
  if(result.status!==0){
    console.error(`syntax-check: FAIL ${file}`);
    console.error(result.stderr||result.stdout);
    process.exit(1);
  }
}
console.log(`syntax-check: OK (${files.length} arquivos JS)`);
