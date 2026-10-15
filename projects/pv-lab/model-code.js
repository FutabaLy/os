const actions = {
  "进门": "enter()",
  "参观": "visit()",
  "出门": "exit()",
  "挖出一个坑": "digHole()",
  "放苗并填土": "plantAndFill()",
  "为一棵树浇水": "waterTree()",
  "C1 · 写入": "C1()",
  "C2 · 读取": "C2()",
  "思考": "think()",
  "开始进餐": "startEating()",
  "结束进餐": "finishEating()",
  "准备产品": "prepareItem()",
  "放入产品": "putItem()",
  "取出产品": "takeItem()",
  "消费产品": "consumeItem()",
  "A": "A()",
  "B": "B()",
  "C": "C()",
  "D": "D()",
  "E": "E()",
  "F": "F()"
};
export function modelCode(model, kind) {
  const names = {buffer:['Producer','Consumer'],deadlock:['Producer','Consumer'],museum:['Visitor1','Visitor2','Visitor3'],tree:['Digger','Planter','Waterer'],precedence:['T1','T2'],once:['P1','P2'],philosophers:['Philosopher0','Philosopher1','Philosopher2','Philosopher3','Philosopher4']};
  const lines = [kind === 'deadlock' ? '// INCORRECT EXAMPLE: holding mutex while waiting can deadlock.' : '// P = wait; V = signal. Processes execute concurrently.'];
  for (const [name, value] of Object.entries(model.sems)) lines.push(`semaphore ${name} = ${value};`);
  model.processes.forEach((process, index) => {
    lines.push('', `process ${names[kind][index]}() {`);
    if (process.loop) lines.push('  while (true) {');
    for (const op of process.code) {
      const statement = op.op === 'action' ? actions[op.text] : `${op.op}(${op.name})`;
      if (!statement) throw new Error(`Missing code label: ${op.text}`);
      lines.push(`${process.loop ? '    ' : '  '}${statement};`);
    }
    if (process.loop) lines.push('  }');
    lines.push('}');
  });
  return lines.join('\n');
}
