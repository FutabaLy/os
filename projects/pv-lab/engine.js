// 记录型信号量教学调度器。每次 step 原子地完成一条伪代码。
export const P = name => ({op:'P', name, text:`P(${name})`});
export const V = name => ({op:'V', name, text:`V(${name})`});
export const action = (text, delta = {}, guard = null) => ({op:'action', text, delta, guard});
const process = (name, code, loop = true) => ({name, code, loop});
export function makeModel(kind = 'buffer', capacity = 3) {
  const n = Math.max(1, Math.min(6, Number(capacity) || 3));
  if (kind === 'museum') return {title:'容量与门锁分开管',note:'2013 年第 45 题的缩小演示：原题容量 500，此处用 N 个名额便于观察。参观时不持门锁。',sems:{slots:n,door:1},vars:{inside:0},capacity:n,resource:'馆内人数',key:'inside',processes:[0,1,2].map(i=>process(`游客 ${i+1}`,[P('slots'),P('door'),action('进门',{inside:1}),V('door'),action('参观'),P('door'),action('出门',{inside:-1}),V('door'),V('slots')]))};
  if (kind === 'tree') return {title:'植树流水线',note:'2025 年第 45 题：坑位上限固定为 3。只有甲、乙共用铁锹；丙独用水桶，无需额外水桶锁。',sems:{space:3,pit:0,planted:0,shovel:1},vars:{holes:0,trees:0,watered:0},capacity:3,resource:'待填树坑',key:'holes',processes:[process('甲 · 挖坑',[P('space'),P('shovel'),action('挖出一个坑',{holes:1}),V('shovel'),V('pit')]),process('乙 · 栽树',[P('pit'),P('shovel'),action('放苗并填土',{holes:-1,trees:1}),V('shovel'),V('space'),V('planted')]),process('丙 · 浇水',[P('planted'),action('为一棵树浇水',{trees:-1,watered:1})])]};
  if (kind === 'precedence') return {title:'先后关系只加在跨线程边上',note:'2022 年第 46 题：T1 内 A→E→F，T2 内 B→C→D 已由代码顺序保证。只需 A→C、C→E 两条跨线程通知。',sems:{aDone:0,cDone:0},vars:{A:0,B:0,C:0,D:0,E:0,F:0},processes:[process('T1',[action('A',{A:1}),V('aDone'),P('cDone'),action('E',{E:1},['C']),action('F',{F:1},['E'])],false),process('T2',[action('B',{B:1}),P('aDone'),action('C',{C:1},['A','B']),V('cDone'),action('D',{D:1},['C'])],false)]};
  if (kind === 'once') return {title:'一次写入，一次读取',note:'2024 年第 46 题第 (2) 问：初始空、仅一次写与一次读。一个 done=0 就够；不能直接套到无限循环生产消费。',sems:{done:0},vars:{items:0},capacity:1,resource:'缓冲区数据',key:'items',processes:[process('P1',[action('C1 · 写入',{items:1}),V('done')],false),process('P2',[P('done'),action('C2 · 读取',{items:-1})],false)]};
  if (kind === 'philosophers') {
    const forks=Object.fromEntries(Array.from({length:5},(_,i)=>[`fork${i}`,1]));
    return {title:'碗限制抢筷子人数',note:'2019 年第 43 题的 n=5 演示；m 由容量控件指定。permit=min(m,4) 限制抢筷子人数，同时进餐最多 min(m,2) 人。',sems:{permit:Math.min(n,4),...forks},vars:{eating:0},capacity:Math.min(n,2),resource:'正在进餐',key:'eating',processes:Array.from({length:5},(_,i)=>process(`哲学家 ${i}`,[action('思考'),P('permit'),P(`fork${i}`),P(`fork${(i+1)%5}`),action('开始进餐',{eating:1}),action('结束进餐',{eating:-1}),V(`fork${(i+1)%5}`),V(`fork${i}`),V('permit')]))};
  }
  const wrong=kind==='deadlock';
  const acquire=(s)=>wrong?[P('mutex'),P(s)]:[P(s),P('mutex')];
  return {title:wrong?'错误顺序：持锁等待资源':'生产者—消费者',note:wrong?'复现步骤：连续点消费者两次，再点生产者两次。消费者等 full，生产者等 mutex，形成死锁。':'先申请空位或产品，再锁缓冲区；操作完成后解锁并通知对方。记录型信号量可能为负，不直接等于实物数量。',sems:{empty:n,full:0,mutex:1},vars:{items:0,produced:0,consumed:0},capacity:n,resource:'缓冲区产品',key:'items',processes:[process('生产者',[action('准备产品'),...acquire('empty'),action('放入产品',{items:1,produced:1}),V('mutex'),V('full')]),process('消费者',[...acquire('full'),action('取出产品',{items:-1,consumed:1}),V('mutex'),V('empty'),action('消费产品')])]};
}
export function createState(model) {
  return {sems:Object.fromEntries(Object.entries(model.sems).map(([name,value])=>[name,{value,initial:value,waiters:[],p:0,v:0}])),vars:{...model.vars},processes:model.processes.map(p=>({...p,pc:0,blocked:null,done:false,cycles:0})),tick:0,log:[],last:null};
}
export function status(s) {
  if(s.processes.every(p=>p.done)) return 'complete';
  if(s.processes.every(p=>p.done || p.blocked)) return 'deadlock';
  return 'ready';
}
export function step(s,index) {
  const p=s.processes[index];
  if(!p || p.done || p.blocked) return false;
  const op=p.code[p.pc]; const line=p.pc; let result='执行完成';
  if(op.op==='P') {
    const sem=s.sems[op.name]; sem.value--;sem.p++;
    if(sem.value<0) {sem.waiters.push(index);p.blocked=op.name;result=`资源不足，阻塞在 ${op.name} 队列`;} else result='申请成功，继续执行';
  } else if(op.op==='V') {
    const sem=s.sems[op.name];sem.value++;sem.v++;
    if(sem.value<=0) {const wake=sem.waiters.shift();s.processes[wake].blocked=null;result=`唤醒 ${s.processes[wake].name} → 就绪（不会重复 P）`;} else result='没有等待者，积累一个许可';
  } else {
    if(op.guard && op.guard.some(key=>!s.vars[key])) throw new Error('前驱约束被破坏');
    for(const [key,delta] of Object.entries(op.delta)) s.vars[key]+=delta;
  }
  p.pc++;if(p.pc===p.code.length){if(p.loop){p.pc=0;p.cycles++;}else p.done=true;}
  s.tick++;s.last={index,line};s.log.push({tick:s.tick,name:p.name,text:op.text,result});
  return true;
}
