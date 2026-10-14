import {makeModel,createState,step,status} from './engine.js';
import {questions,years} from './questions.js';
const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let model=makeModel(),state=createState(model),history=[],timer=null,cursor=0,currentYear=2009;
let progress={},drafts={},storageWorks=true;
try {progress=JSON.parse(localStorage.getItem('os-pv-progress-v1')||'{}');drafts=JSON.parse(localStorage.getItem('os-pv-drafts-v1')||'{}');if(!progress||typeof progress!=='object')progress={};if(!drafts||typeof drafts!=='object')drafts={};} catch {storageWorks=false;}
function save(){try{localStorage.setItem('os-pv-progress-v1',JSON.stringify(progress));localStorage.setItem('os-pv-drafts-v1',JSON.stringify(drafts));}catch{storageWorks=false;}}
function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent='▶ 自动';}
function openTab(name,writeHash=true){
  if(!['learn','lab','exam','summary'].includes(name))name='learn';
  if(name!=='lab')stop();
  document.querySelectorAll('.panel').forEach(el=>el.hidden=el.id!==name);
  document.querySelectorAll('[data-tab]').forEach(el=>{el.classList.toggle('active',el.dataset.tab===name);el.setAttribute('aria-pressed',String(el.dataset.tab===name));});
  if(writeHash)window.history.replaceState(null,'',name==='exam'?`#exam-${currentYear}`:`#${name}`);
}
document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',()=>openTab(el.dataset.tab)));
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openTab(el.dataset.open)));
function reset(){stop();model=makeModel($('model').value,$('capacity').value);state=createState(model);history=[];cursor=0;renderLab();}
function run(index){
  if(state.processes[index]?.done || state.processes[index]?.blocked)return;
  history.push(structuredClone(state));if(history.length>400)history.shift();
  step(state,index);if(status(state)!=='ready')stop();renderLab();
}
function next(){for(let offset=0;offset<state.processes.length;offset++){const i=(cursor+offset)%state.processes.length;if(!state.processes[i].done&&!state.processes[i].blocked){cursor=(i+1)%state.processes.length;run(i);return;}}stop();}
$('next').addEventListener('click',next);
$('reset').addEventListener('click',reset);
$('model').addEventListener('change',reset);$('capacity').addEventListener('change',reset);
$('undo').addEventListener('click',()=>{stop();if(history.length){state=history.pop();renderLab();}});
$('play').addEventListener('click',()=>{if(timer){stop();return;}if(status(state)!=='ready')return;$('play').textContent='⏸ 暂停';timer=setInterval(next,850);});
function renderLab(){
  const st=status(state);$('model-title').textContent=model.title;$('model-note').textContent=model.note;
  $('status').textContent={ready:'● 可继续调度',deadlock:'■ 全部阻塞 · 死锁',complete:'✓ 所有操作完成'}[st];
  $('status').style.color=st==='deadlock'?'#ffa0b4':st==='complete'?'#8ee4c4':'#e1e6ff';
  $('capacity-label').hidden=['tree','precedence','once'].includes($('model').value);
  $('capacity').disabled=['tree','precedence','once'].includes($('model').value);
  $('undo').disabled=history.length===0;$('next').disabled=st!=='ready';$('play').disabled=st!=='ready';
  $('semaphores').innerHTML=Object.entries(state.sems).map(([name,s])=>`<div class="sem ${s.value<0?'blocked':''}"><div class="sem-head"><span>${esc(name)}</span><strong>${s.value}</strong></div><small>初值 ${s.initial} · P ${s.p} 次 · V ${s.v} 次</small><div class="waiters">${s.waiters.length?'等待：'+s.waiters.map(i=>esc(state.processes[i].name)).join('、'):'等待队列为空'}</div></div>`).join('');
  $('tick').textContent=`第 ${state.tick} 步`;$('resource-title').textContent=model.resource||'前驱操作完成情况';
  if(model.key){const count=state.vars[model.key];$('resource-visual').innerHTML=`<div class="slots">${Array.from({length:model.capacity},(_,i)=>`<span class="slot ${i<count?'filled':''}">${i<count?'● 已占':'○ 空位'}</span>`).join('')}</div>`;}
  else $('resource-visual').innerHTML=`<div class="nodes">${Object.entries(state.vars).map(([key,v])=>`<span class="${v?'finished':''}">${key} ${v?'✓':'待执行'}</span>`).join('')}</div><p class="muted">A、B → C → D / E；E → F。绿色表示动作已完成。</p>`;
  $('variables').innerHTML=Object.entries(state.vars).map(([key,value])=>`<span>${esc(key)} = ${value}</span>`).join('');
  $('processes').innerHTML=state.processes.map((p,i)=>`<article class="card process ${p.blocked?'is-blocked':''}"><div class="process-head"><h3>${esc(p.name)}</h3><span class="pill">${p.done?'已结束':p.blocked?'阻塞':'就绪'}</span></div><ol class="code-lines">${p.code.map((op,j)=>`<li class="${!p.done&&(p.blocked?j===p.pc-1:j===p.pc)?'current':''}">${esc(op.text)}</li>`).join('')}</ol><span class="muted">${p.blocked?`等待 ${esc(p.blocked)}；唤醒后继续下一行`:p.done?'一次性操作已完成':`下一条：${esc(p.code[p.pc].text)} · 已完成 ${p.cycles} 轮`}</span><button data-process="${i}" ${p.blocked||p.done?'disabled':''}>执行 ${esc(p.name)} 一步</button></article>`).join('');
  document.querySelectorAll('[data-process]').forEach(el=>el.addEventListener('click',()=>{stop();run(Number(el.dataset.process));}));
  $('trace').innerHTML=state.log.length?state.log.slice(-80).reverse().map(l=>`<div class="trace-row"><span>#${l.tick}</span><strong>${esc(l.name)}</strong><code>${esc(l.text)}</code><span>${esc(l.result)}</span></div>`).join(''):'<p class="muted">尚未执行。点击任一进程的按钮，或使用“调度一步”。紫色行是下一条指令；粉色行是正在等待的 P。</p>';
}
function renderYears(){
  const filter=$('filter').value;
  const list=years.filter(y=>filter==='all'||filter===y.status||(filter==='todo'&&questions.some(q=>q.year===y.year)&&!progress[y.year]));
  $('years').innerHTML=list.map(y=>`<button class="year-button ${y.year===currentYear?'active':''} ${y.status==='无本专题大题'?'absent':''}" data-year="${y.year}" aria-pressed="${y.year===currentYear}"><strong>${y.year} ${progress[y.year]?'✓':''}</strong><small>${y.status==='无本专题大题'?'无相关大题':y.status}</small></button>`).join('')||'<p class="muted">该筛选下没有题目。</p>';
  document.querySelectorAll('[data-year]').forEach(el=>el.addEventListener('click',()=>{currentYear=Number(el.dataset.year);renderYears();renderQuestion();openTab('exam');}));
  $('progress').textContent=`已标记掌握 ${questions.filter(q=>progress[q.year]).length} / ${questions.length}`;
}
$('filter').addEventListener('change',()=>{const f=$('filter').value;const valid=years.filter(y=>f==='all'||f===y.status||(f==='todo'&&questions.some(q=>q.year===y.year)&&!progress[y.year]));if(valid.length&&!valid.some(y=>y.year===currentYear)){currentYear=valid[0].year;renderQuestion();openTab('exam');}renderYears();});
function renderQuestion(){
  const data=questions.find(q=>q.year===currentYear);const year=years.find(y=>y.year===currentYear);
  if(!data){$('question').innerHTML=`<span class="pill">${year.year} · 年份核对</span><h2>本年度没有本专题综合大题</h2><p>该年相关综合题主题为：${esc(year.note)}。</p><p class="muted">这不表示该年没有同步互斥选择题。本专题当前覆盖范围是 PV 设计及紧密相关的互斥原理大题。</p><a href="${year.source}" target="_blank" rel="noopener">查看该年公开完整试卷 ↗</a>`;return;}
  $('question').innerHTML=`<span class="pill">${data.year} · 第 ${data.number} 题 · ${data.kind}</span><h2>${esc(data.title)}</h2><div class="sources"><a href="${data.source}" target="_blank" rel="noopener">原卷与题号核对 ↗</a><span>公开转载，非官方授权题库 · 下文为题意概述</span></div><div class="stem">${esc(data.stem)}</div><label for="draft">先写你的信号量定义与伪代码</label><textarea id="draft" placeholder="例如：semaphore empty=N, full=0, mutex=1;\n列出每个角色的动作，再填 P/V。"></textarea><p class="draft-note" id="draft-status">${storageWorks?'草稿与掌握标记仅保存在当前浏览器。':'当前浏览器无法保存；草稿仅保留在本次页面会话。'}</p><div class="question-actions"><button id="mark" class="primary">${progress[data.year]?'✓ 已掌握 · 点击取消':'标记已掌握'}</button><button id="to-model">打开关联模型演示 →</button></div><details id="solution"><summary>展开解题步骤、信号量表与参考代码</summary><h3>① 从题意拆关系</h3><ol class="steps">${data.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><h3>② 定义与初值</h3><div class="table-scroll"><table><thead><tr><th>信号量 / 变量</th><th>初值</th><th>含义</th></tr></thead><tbody>${data.semaphores.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><h3>③ 一种可行的参考实现</h3><pre>${esc(data.code)}</pre><p class="muted">代码为考试风格伪代码，不是可直接编译的 C。允许存在满足同样约束的其他解法。</p><h3>④ 关键边界与易错点</h3><ul class="checklist">${data.pitfalls.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><h3>⑤ 对照自查</h3><div class="selfcheck">${['定义、含义与初值完整','每个等待都有对应的通知或释放','没有资源越界、漏通知或循环等待','保留题目允许的并发，没有多余约束'].map(s=>`<label><input type="checkbox">${s}</label>`).join('')}</div><p class="muted">自由书写答案由你对照参考方案自查，本站不将关键词命中当成主观题得分。</p></details><div class="practice"><h3>关键一步 · 自编知识检查</h3><p>${esc(data.check.prompt)}</p><div class="practice-options">${data.check.options.map((o,i)=>`<button data-option="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}</div><p id="feedback" class="feedback" role="status"></p></div>`;
  $('draft').value=drafts[data.year]||'';
  $('draft').addEventListener('input',()=>{drafts[data.year]=$('draft').value;save();$('draft-status').textContent=storageWorks?'已自动保存到当前浏览器。':'无法写入浏览器存储；当前草稿尚在本次会话中。';});
  $('mark').addEventListener('click',()=>{progress[data.year]=!progress[data.year];save();$('mark').textContent=progress[data.year]?'✓ 已掌握 · 点击取消':'标记已掌握';renderYears();});
  $('to-model').addEventListener('click',()=>{$('model').value=data.model;reset();openTab('lab');});
  document.querySelectorAll('[data-option]').forEach(el=>el.addEventListener('click',()=>{const correct=Number(el.dataset.option)===data.check.answer;document.querySelectorAll('[data-option]').forEach(o=>o.classList.remove('chosen'));el.classList.add('chosen');$('feedback').className='feedback '+(correct?'correct':'wrong');$('feedback').textContent=(correct?'✓ 正确。':'还不对。')+data.check.why;}));
}
$('print').addEventListener('click',()=>window.print());
function route(){const match=location.hash.match(/^#exam-(20\d{2})$/);if(match&&years.some(y=>y.year===Number(match[1]))){currentYear=Number(match[1]);renderYears();renderQuestion();openTab('exam',false);}else openTab(location.hash.slice(1)||'learn',false);}
window.addEventListener('hashchange',route);window.addEventListener('pagehide',stop);
renderLab();renderYears();renderQuestion();route();
