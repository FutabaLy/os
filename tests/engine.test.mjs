import {modelCode} from '../projects/pv-lab/model-code.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeModel,createState,step,status} from '../projects/pv-lab/engine.js';
import {questions,years} from '../projects/pv-lab/questions.js';
import {readFileSync,existsSync} from 'node:fs';
function invariant(s,model){
  for(const [name,sem] of Object.entries(s.sems)){
    assert.equal(sem.value,sem.initial+sem.v-sem.p,name+' accounting');
    assert.equal(sem.waiters.length,Math.max(0,-sem.value),name+' waiters');
    assert.equal(new Set(sem.waiters).size,sem.waiters.length);
    for(const i of sem.waiters)assert.equal(s.processes[i].blocked,name);
  }
  for(let i=0;i<s.processes.length;i++)if(s.processes[i].blocked)assert(s.sems[s.processes[i].blocked].waiters.includes(i));
  if(model.key){assert(s.vars[model.key]>=0);assert(s.vars[model.key]<=model.capacity);}
  if(model.title==='植树流水线'){assert(s.vars.trees>=0);assert(s.vars.watered>=0);}
}
test('P blocks once; V wakes into ready without another decrement',()=>{
  const s=createState(makeModel('buffer',1));
  step(s,1);assert.equal(s.sems.full.value,-1);assert.equal(s.processes[1].pc,1);
  assert.equal(step(s,1),false);assert.equal(s.sems.full.value,-1);
  for(let i=0;i<6;i++)step(s,0);
  assert.equal(s.sems.full.value,0);assert.equal(s.processes[1].blocked,null);
  step(s,1);assert.equal(s.sems.full.p,1);assert.equal(s.processes[1].pc,2);
});
test('bad lock order has a concrete deadlock witness',()=>{
  const s=createState(makeModel('deadlock',3));
  for(const i of [1,1,0,0])step(s,i);
  assert.equal(status(s),'deadlock');assert.equal(s.processes[1].blocked,'full');assert.equal(s.processes[0].blocked,'mutex');
});
for(const kind of ['buffer','museum','tree','precedence','once','philosophers'])test(kind+' preserves accounting and capacity across seeded interleavings',()=>{
  for(const capacity of [1,3,6])for(let seed=1;seed<=15;seed++){
    const model=makeModel(kind,capacity),s=createState(model);let rng=seed;
    for(let t=0;t<800;t++){
      invariant(s,model);if(status(s)==='complete')break;
      assert.notEqual(status(s),'deadlock',`${kind}, capacity ${capacity}, seed ${seed}`);
      const runnable=s.processes.map((p,i)=>!p.done&&!p.blocked?i:-1).filter(i=>i>=0);
      rng=(Math.imul(rng,1664525)+1013904223)>>>0;
      step(s,runnable[rng%runnable.length]);
    }
    invariant(s,model);
    if(kind==='precedence')assert.deepEqual(s.vars,{A:1,B:1,C:1,D:1,E:1,F:1});
  }
});
test('all finite precedence schedules respect cross-thread constraints',()=>{
  const model=makeModel('precedence'),queue=[createState(model)],seen=new Set();let complete=0;
  while(queue.length){
    const s=queue.pop();const key=JSON.stringify([s.vars,s.sems,s.processes.map(p=>[p.pc,p.blocked,p.done])]);if(seen.has(key))continue;seen.add(key);
    invariant(s,model);assert(!s.vars.C||(s.vars.A&&s.vars.B));assert(!s.vars.E||s.vars.C);assert(!s.vars.F||s.vars.E);
    if(status(s)==='complete'){complete++;continue;}assert.notEqual(status(s),'deadlock');
    s.processes.forEach((p,i)=>{if(!p.blocked&&!p.done){const copy=structuredClone(s);step(copy,i);queue.push(copy);}});
  }
  assert(complete>0);assert(seen.size>10);
});
test('question coverage, source links and self-check answers are complete',()=>{
  assert.equal(questions.length,13);assert.equal(years.length,18);
  assert.equal(questions.filter(q=>q.kind==='PV 设计').length,11);
  assert.deepEqual(years.map(y=>y.year),Array.from({length:18},(_,i)=>2009+i));
  assert.equal(questions.find(q=>q.year===2014).number,47);assert.equal(questions.find(q=>q.year===2019).number,43);
  for(const q of questions){assert(q.source.includes(String(q.year)));assert(q.code.length>50);assert(q.steps.length>=3);assert(q.check.answer>=0&&q.check.answer<q.check.options.length);assert(q.semaphores.length>0);}
  assert.equal(new Set(questions.map(q=>q.year)).size,13);
});
test('static entry has all locally referenced files and no external style dependency',()=>{
  const url=new URL('../projects/pv-lab/index.html',import.meta.url);const html=readFileSync(url,'utf8');
  for(const [,path]of html.matchAll(/(?:src|href)="([^"#]+\.(?:css|js))"/g))assert(existsSync(new URL(path,url)));
  assert(!html.includes('cdn.tailwindcss.com'));
  for(const section of ['learn','lab','exam','summary'])assert(html.includes(`id="${section}"`));
});

test('answer and model code use English-only pseudocode with matching semaphore values',()=>{
  for(const q of questions) assert(!/[^\x00-\x7F]/.test(q.code), String(q.year));
  for(const kind of ['buffer','deadlock','museum','tree','precedence','once','philosophers']) {
    for(const capacity of [1,3,6]) {
      const model=makeModel(kind,capacity), code=modelCode(model,kind);
      assert(!/[^\x00-\x7F]/.test(code));
      for(const [name,value] of Object.entries(model.sems)) assert(code.includes(`semaphore ${name} = ${value};`));
      assert.equal((code.match(/^process /gm)||[]).length,model.processes.length);
      assert.equal((code.match(/\b[PV]\(/g)||[]).length,model.processes.reduce((n,p)=>n+p.code.filter(op=>op.op!=='action').length,0));
    }
  }
});
