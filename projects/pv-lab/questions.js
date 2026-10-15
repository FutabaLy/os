// 题意为简述，解析与代码为本项目教学推导；原题全文见逐题来源。
const source = year => `https://www.csgraduates.com/study_methods/408quiz/${year}/`;
const q=(year,number,title,model,stem,semaphores,steps,code,pitfalls,check)=>({year,number,title,model,stem,semaphores,steps,code,pitfalls,check,source:source(year),kind:[2021,2023].includes(year)?'原理分析':'PV 设计'});
export const questions=[
q(2009,45,'奇偶分流：通知正确的消费者','buffer',
'一个容量为 N 的共享区接收正整数。一个进程负责放入，另外两个分别只取奇数、偶数并统计。写出三者的同步互斥方案。',
[['slots','N','尚可申请的空位'],['oddReady','0','已发布的奇数许可'],['evenReady','0','已发布的偶数许可'],['lock','1','共享区操作互斥']],
['先找共享区：三个角色都操作它，用同一把锁。','再按消费者条件拆通知：奇数和偶数不能共用一个 ready。','放入后按类型 V；取出后归还空位。统计移到锁外。'],
`semaphore slots=N, oddReady=0, evenReady=0, lock=1;
Producer: while (true) {
  x = generatePositiveInteger();
  P(slots); P(lock);
  insert(x);
  V(lock);
  if (x % 2 == 1) V(oddReady); else V(evenReady);
}
OddConsumer: while (true) {
  P(oddReady); P(lock);
  x = removeOdd();
  V(lock); V(slots);
  countOdd(x);
}
EvenConsumer: while (true) {
  P(evenReady); P(lock);
  x = removeEven();
  V(lock); V(slots);
  countEven(x);
}`,
['一个 full 不能告诉被唤醒者里面是否有自己能取的类型。','不要持有 lock 再等 oddReady 或 slots。'],
{prompt:'共享区初始为空，oddReady 的初值应为？',options:['0','1','N'],answer:0,why:'奇数尚未产生，没有可消费的奇数许可。'}),
q(2011,45,'银行叫号：座位、取号与服务','museum',
'银行有一个柜台、十个等候位和一台取号机。顾客先占位取号，再等待被叫到；柜员空闲时选择下一位顾客服务。补全同步互斥。',
[['seats','10','等候名额'],['queueLock','1','取号与队列操作的锁'],['waiting','0','已入队的顾客'],['called[i] / arrived[i] / finished[i]','均为 0','对应顾客的叫号、到柜台、服务完成通知']],
['容量管等候座位，不是把整个银行锁成单人。','用队列保存取号次序；锁内取号入队，不能在锁内等叫号。','下面给出带顾客身份的完整握手版：called[i] 防止叫到甲却由乙领取通知；到柜台后释放座位。'],
`semaphore seats=10, queueLock=1, waiting=0;
// Initialize private semaphores called[i], arrived[i], finished[i] to 0 for each customer i.
Customer(i): {
  P(seats);
  P(queueLock); takeTicketAndEnqueue(i); V(queueLock);
  V(waiting);
  P(called[i]);
  goToCounter(); V(seats); V(arrived[i]);
  P(finished[i]); leaveBank();
}
Teller: while (true) {
  P(waiting);
  P(queueLock); i=dequeue(); V(queueLock);
  V(called[i]); P(arrived[i]);
  serve(i); V(finished[i]);
}`,
['本解法显式维护身份与握手，信号量并非最少版；原题没有要求最少。','普通信号量不天然承诺按票号唤醒；不能把 FIFO 服务次序当成任何实现都保证的性质。'],
{prompt:'顾客到柜台接受服务时，等候座位应怎样处理？',options:['一直占用到离开银行','归还一个等候名额','将所有座位清零'],answer:1,why:'座位限制的是等待区，已离开等待区的顾客应归还名额。'}),
q(2013,45,'博物馆：限流不等于串行参观','museum',
'馆内容量上限为 500，进出共用一个每次只过一人的门。为游客的进门、参观、出门三个阶段配置 P/V。',
[['quota','500','可预订的入馆名额'],['door','1','进出门互斥']],
['容量与门是两种资源，分开设信号量。','入场先预订名额，再进入门的临界区。','参观在门锁外；离馆穿门完成后归还名额。'],
`semaphore quota=500, door=1;
Visitor: {
  P(quota);
  P(door); enter(); V(door);
  visit();
  P(door); exit(); V(door);
  V(quota);
}`,
['若持门锁等名额，满馆时会挡住出门的人，形成循环等待。','把参观夹在 door 内会使所有参观串行化。'],
{prompt:'门锁 door 的初值是多少？',options:['500','0','1'],answer:2,why:'门一次只允许一个人通过，互斥许可只有一个。'}),
q(2014,47,'连续取十件：批次锁与缓冲锁','buffer',
'多个生产者、消费者共享初始为空的千件环形区。一名消费者一旦开始取货，必须连续取完十件，其他消费者才能接手。',
[['space','1000','可写空位'],['ready','0','可取产品'],['bufferLock','1','单次访问缓冲区'],['batchLock','1','消费者十件批次互斥']],
['先按普通有界缓冲区写出单件取放。','只在消费者一侧增加 batchLock，覆盖十次取货。','bufferLock 每件释放；缺货时只持 batchLock 等待，生产者仍可补货。'],
`semaphore space=1000, ready=0, bufferLock=1, batchLock=1;
Producer: while (true) {
  x=produce(); P(space); P(bufferLock);
  insert(x); V(bufferLock); V(ready);
}
Consumer: while (true) {
  P(batchLock);
  for (i=0; i<10; i++) {
    P(ready); P(bufferLock);
    x=remove(); V(bufferLock); V(space);
    consume(x);
  }
  V(batchLock);
}`,
['初始空：space=1000、ready=0，不能颠倒。','连续取十件不要求开始前已有十件；可等待生产者继续供货。','不要把 bufferLock 锁住整个十件循环。'],
{prompt:'取到第 6 件后暂时缺货，应持有哪些锁等待？',options:['bufferLock 和 batchLock','只持 batchLock','只持 bufferLock'],answer:1,why:'要阻止其他消费者插入批次，同时允许生产者进入缓冲区补货。'}),
q(2015,45,'双信箱：初值由现状决定','buffer',
'A、B 各从自己的信箱取一封来信，处理后向对方投一封。A 容量 M、已有 x 封；B 容量 N、已有 y 封，且两箱初始都非空非满。',
[['aFull / aEmpty','x / M−x','A 箱来信与空位'],['bFull / bEmpty','y / N−y','B 箱来信与空位'],['aLock / bLock','1 / 1','各信箱互斥']],
['每个信箱独立配置空、满和锁。','自己是本箱消费者、对方箱生产者；不要把邮箱方向写反。','先取出并归还本箱空位，再处理并投向对方，不同时持有两箱锁。'],
`semaphore aFull=x, aEmpty=M-x, bFull=y, bEmpty=N-y;
semaphore aLock=1, bLock=1;
A: while (true) {
  P(aFull); P(aLock); receiveA(); V(aLock); V(aEmpty);
  replyAndPrepareMessage();
  P(bEmpty); P(bLock); sendB(); V(bLock); V(bFull);
}
B: while (true) {
  P(bFull); P(bLock); receiveB(); V(bLock); V(bEmpty);
  replyAndPrepareMessage();
  P(aEmpty); P(aLock); sendA(); V(aLock); V(aFull);
}`,
['不是所有同步量都从 0 开始。','不能让 A 等待 aEmpty 才去取 A 箱：取出应等待的是 aFull。'],
{prompt:'A 箱的空位信号量初值为？',options:['M','M−x','x'],answer:1,why:'已有 x 封占位，所以剩余 M−x 个位置。'}),
q(2017,46,'三线程复数：只锁冲突关系','once',
'T1 读取 x、y 求和；T2 读取 y、z 求和；T3 先更新 z 再更新 y。要求保护共享数据，同时保留读者之间的并发。局部变量各自独立。',
[['y13','1','T1 读 y 与 T3 写 y 的互斥'],['y23','1','T2 读 y 与 T3 写 y 的互斥'],['z23','1','T2 读 z 与 T3 写 z 的互斥']],
['x 只有读者，不需要为 x 额外加锁。','T1 与 T2 都只读，可以同时执行；一把全局锁会降低并发。','为每组读写冲突设锁；T3 写 y 要同时阻止两个读者。'],
`semaphore y13=1, y23=1, z23=1;
T1: {
  P(y13); w=add(x,y); V(y13);
}
T2: {
  P(y23); P(z23); w=add(y,z); V(z23); V(y23);
}
T3: {
  w.a=1; w.b=2;
  P(z23); z=add(z,w); V(z23);
  P(y13); P(y23); y=add(y,w); V(y23); V(y13);
}`,
['add 的局部变量不是共享临界资源。','先释放 z23 再申请 y13/y23，避免不必要的跨更新持锁。','演示区的一次读写用于理解互斥，不是该题三线程的逐行仿真。'],
{prompt:'T1 与 T2 是否必须互斥？',options:['必须，调用了同名 add','不必，它们只读共享数据','必须，局部变量都叫 w'],answer:1,why:'读读不冲突；函数局部变量在线程各自的栈中。'}),
q(2019,43,'哲学家：碗既是资源也是限流器','philosophers',
'n≥3 位哲学家围桌，有 n 根相邻共享的筷子和 m≥1 个碗。每次需一个碗及左右两根筷子。设计不死锁且允许尽量多的人同时就餐的方案。',
[['permit','min(m,n−1)','同时参与取筷子的名额'],['fork[i]','每个为 1','第 i 根筷子']],
['每根筷子是独占资源，分别设互斥量。','先用 permit 控制最多 n−1 人进入取筷子阶段，切断全员各持一根的环。','碗较少时还要受 m 限制；进餐上限与取筷子许可数是两个不同数字。'],
`semaphore permit=min(m,n-1);
// Initialize every fork[i] to 1 for i = 0, ..., n-1.
Philosopher(i): while (true) {
  think(); P(permit);
  P(fork[i]); P(fork[(i+1)%n]);
  eat();
  V(fork[(i+1)%n]); V(fork[i]); V(permit);
}`,
['不能把所有 fork 用某些 C 初始化写法误设为只有第一个是 1。','最多同时进餐 min(m,⌊n/2⌋)，不是 min(m,n−1)。','防死锁不自动证明任意不公平调度下都无饥饿。'],
{prompt:'n=5、m=5 时，permit 的初值与最多同时进餐人数是？',options:['5 与 5','4 与 4','4 与 2'],answer:2,why:'取筷子阶段限 4 人，实际互不相邻进餐最多 2 人。'}),
q(2020,45,'五操作前驱：汇合处要等齐','precedence',
'五个独立操作中，C 必须等 A、B 都结束，E 必须等 C、D 都结束。用 P/V 表达全部前驱约束。',
[['ac / bc / ce / de','全部为 0','四条前驱边上的完成通知']],
['先画 A→C、B→C、C→E、D→E。','每条边分别从 0 开始，起点执行后 V，终点执行前 P。','汇合是 AND：需要两条许可，而不是任意一个前驱完成就继续。'],
`semaphore ac=0, bc=0, ce=0, de=0;
A: { executeA(); V(ac); }
B: { executeB(); V(bc); }
C: { P(ac); P(bc); executeC(); V(ce); }
D: { executeD(); V(de); }
E: { P(ce); P(de); executeE(); }`,
['不要把前驱通知初值置 1，否则后继可以抢跑。','演示选择 2022 的跨线程前驱模型；本题按五个独立操作分析。'],
{prompt:'C 执行前需要满足什么？',options:['A 或 B 任一个完成','A 和 B 都完成','只等 A'],answer:1,why:'两条入边是共同约束，分别 P(ac)、P(bc)。'}),
q(2021,45,'原语实现：关中断后为何不能死等','deadlock',
'比较两种整型信号量实现：一是在关中断状态下一直等待 S>0；二是在等待循环里短暂开中断再关中断。分析互斥、进展性及用户态权限。',
[['S','题设给定','被原语共同访问的计数；本题是整型忙等实现']],
['S 的读改写必须原子化，否则会丢失更新。','在单处理机题设下，关闭中断后一直自旋，其他进程没有机会执行 signal。','循环内打开中断允许调度；最终检查与减一仍在关中断区完成。开关中断是特权操作。'],
`// Method 2 under the single-CPU assumption; not a general multicore implementation.
wait(S): {
  disableInterrupts();
  while (S <= 0) { enableInterrupts(); disableInterrupts(); }
  S = S - 1;
  enableInterrupts();
}
signal(S): { disableInterrupts(); S = S + 1; enableInterrupts(); }
// Method 1 keeps interrupts disabled while spinning: no progress when S <= 0.
// Interrupt control requires privileged execution.`,
['不要把整型信号量的忙等与记录型信号量的阻塞混为一谈。','本核关中断不能阻止其他核并发访问 S。','演示里的死锁是持锁等资源，帮助理解进展性，不是 CPU 中断仿真。'],
{prompt:'本核关中断可以作为通用多核互斥手段吗？',options:['可以，所有核都会停','不可以，其他核仍可访问共享变量','只要 S=1 就可以'],answer:1,why:'局部中断屏蔽不等于跨 CPU 的原子互斥。'}),
q(2022,46,'两线程六操作：省掉天然顺序','precedence',
'T1 按 A、E、F 执行，T2 按 B、C、D 执行。额外要求 C 在 A、B 后，D、E 在 C 后，F 在 E 后。配置必要的同步。',
[['aDone','0','A 已完成，可执行 C'],['cDone','0','C 已完成，可执行 E']],
['同一线程内的 B→C→D、A→E→F 由程序次序保证。','只为跨线程的 A→C 与 C→E 设置通知。','D 与 E 没有先后要求，不要加锁把它们强行串行。'],
`semaphore aDone=0, cDone=0;
T1: {
  A(); V(aDone);
  P(cDone); E(); F();
}
T2: {
  B(); P(aDone);
  C(); V(cDone); D();
}`,
['画出的每条边不一定都要信号量：先删掉同线程已保证的边。','如果把 V(cDone) 放在 D 后，会额外限制 E 等待 D。'],
{prompt:'最直接且不增加多余约束的方案需要几个同步信号量？',options:['2','5','6'],answer:0,why:'只有 A→C 与 C→E 是必须补充的跨线程关系。'}),
q(2023,45,'原子 swap 与普通函数的边界','once',
'共享 lock 表示临界区是否被占用，线程以私有 key 与其交换。修改只判断一次、退出时仍上锁的错误代码，并分析普通交换函数能否替代原子指令。',
[['lock','false','共享忙闲标志'],['key','每个线程每次进入前为 true','线程私有的申请标志']],
['一次 if 不能使失败者等待，改为循环反复尝试。','退出将 lock 置 false，才能释放临界区。','普通函数的读取与写回可被交错，不具备原子交换保证。'],
`shared bool lock=false;
Thread: {
  bool key=true;        // Thread-local variable.
  while (key == true)
    atomic_swap(key, lock);
  criticalSection();
  lock=false;
}
// A non-atomic three-assignment swap cannot replace atomic_swap.
// Exam pseudocode: real implementations require atomic types and memory ordering.`,
['这是自旋等待，不是让权等待。','函数看上去只有一行调用，不代表其内部是原子的。'],
{prompt:'失败后仅执行一次 if 再进入临界区会怎样？',options:['自动阻塞','可能多个线程进入临界区','保证公平'],answer:1,why:'没有循环检验，交换失败者也会落入临界区。'}),
q(2024,46,'同一个缓冲区，三种关系','once',
'单分组缓冲区有写入 C1、读出 C2、修改 C3。分别讨论两进程写入；初始空且各做一次写/读；初始非空且各做一次修改。按小问使用尽量少的信号量。',
[['done','0','第 (2) 问写入完成的通知'],['mutex','1','第 (3) 问两次修改的互斥；与前一问独立']],
['C1 访问共享可写对象，是临界区代码。','一次写后一次读只需一条通知，顺序本身消除了重叠。','两次修改不要求固定先后，只要求不重叠，所以用互斥锁。'],
`// Part (2): initially empty; each process runs once.
semaphore done=0;
P1: { C1(); V(done); }
P2: { P(done); C2(); }

// Part (3): initially nonempty; independent of part (2).
semaphore mutex=1;
P1: { P(mutex); C3(); V(mutex); }
P2: { P(mutex); C3(); V(mutex); }`,
['不能把两个独立小问的信号量合起来说需要两个。','一次性条件很关键；循环读写不能仅照搬一个 done。'],
{prompt:'第 (2) 问一次写、一次读，最少需要几个信号量？',options:['3','2','1'],answer:2,why:'done=0 让读发生在写完成后，已经保证这两个动作不重叠。'}),
q(2025,45,'挖坑—填土—浇水：四个量够用','tree',
'甲挖坑、乙放苗填土、丙浇水。未填树坑最多三个；甲乙共享一把铁锹，水桶只有丙使用。初始没有树坑，设计尽量少的信号量。',
[['space','3','可预订的树坑名额'],['pit','0','已挖好待填的坑'],['planted','0','已填土待浇水的树'],['shovel','1','甲乙对铁锹的互斥']],
['两条流水边需要 pit 与 planted，容量约束需要 space。','铁锹是甲乙共享资源，单独设互斥量；水桶没有竞争者。','填土后坑已消失，即可 V(space)，不必等浇水。'],
`semaphore space=3, pit=0, planted=0, shovel=1;
Digger: while (true) {
  P(space); P(shovel); digHole(); V(shovel); V(pit);
}
Planter: while (true) {
  P(pit); P(shovel); plantAndFill(); V(shovel);
  V(space); V(planted);
}
Waterer: while (true) {
  P(planted); waterTree();
}`,
['乙若拿着铁锹等 pit，甲可能无法挖坑，造成死锁。','space 在填土后释放，不是在浇水后；否则加入了题目没有要求的约束。','无需给丙独用的水桶加互斥锁。'],
{prompt:'space 应何时归还？',options:['挖坑后','填土完成后','浇水完成后'],answer:1,why:'space 限制未填的树坑；乙填完土就释放坑位额度。'})
];
const absent={2010:'磁盘调度、页面置换',2012:'驻留集、文件索引',2016:'地址转换、动态优先级调度',2018:'分页与文件索引',2026:'优先级与时间片调度、文件系统'};
export const years=Array.from({length:18},(_,i)=>{const year=2009+i;const item=questions.find(q=>q.year===year);return {year,source:source(year),status:item?item.kind:'无本专题大题',note:item?`第 ${item.number} 题 · ${item.title}`:absent[year]};});
