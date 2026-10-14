# PV 专题：来源与年度清单

核对日期：2026-10-14。范围为 408 统考自 2009 年起的 PV／同步互斥相关综合应用题；不包括所有操作系统题或全部选择题。2026 指试卷年份，不是未来的 2027 年入学考试。

本项目不声称获得官方题库授权。试题身份及条件依据公开试卷转载核对，网页只展示简述与自行编写的教学解法，完整原文请访问每年的来源。第三方解析可能有笔误，不能直接作为程序正确性的证明。

| 年份 | 题号 | 本专题收录情况 | 完整试卷来源 |
| --- | --- | --- | --- |
| 2009 | 45 | PV：奇偶数分类消费 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2009/) |
| 2010 | — | 无本专题大题；磁盘调度、页面置换 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2010/) |
| 2011 | 45 | PV：银行叫号 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2011/) |
| 2012 | — | 无本专题大题；驻留集、文件索引 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2012/) |
| 2013 | 45 | PV：博物馆容量与出入口 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2013/) |
| 2014 | 47 | PV：消费者连续取十件 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2014/) |
| 2015 | 45 | PV：双信箱通信 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2015/) |
| 2016 | — | 无本专题大题；地址转换、优先级调度 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2016/) |
| 2017 | 46 | PV：三线程复数运算 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2017/) |
| 2018 | — | 无本专题大题；分页、文件索引 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2018/) |
| 2019 | 43 | PV：哲学家与碗 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2019/) |
| 2020 | 45 | PV：五操作前驱关系 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2020/) |
| 2021 | 45 | 相关原理：开关中断与原子性 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2021/) |
| 2022 | 46 | PV：两线程六操作 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2022/) |
| 2023 | 45 | 相关原理：原子 swap 互斥 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2023/) |
| 2024 | 46 | PV：一次同步与互斥的区别 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2024/) |
| 2025 | 45 | PV：植树流水线 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2025/) |
| 2026 | — | 无本专题大题；调度与文件系统 | [公开试卷](https://www.csgraduates.com/study_methods/408quiz/2026/) |

共 11 道 PV 设计题，另加 2021、2023 两道紧密相关的原理分析题。不能固定只看第 45、46 题：2014、2019 的题目编排不同。

## 补充核对来源

- [2022 试卷另一转载](https://pgcode.cn/exams/408/years/2022/preview)
- [2025 试卷另一转载](https://pgcode.cn/exams/408/years/2025/preview)
- [2026 试卷另一转载](https://pgcode.cn/exams/408/years/2026/preview)
- [OSTEP 作者公开教材：Semaphores](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf)：用于核对信号量、互斥与顺序控制的基本语义。

## 编写与校验说明

- 2014 年部分转载的解释段将 empty/full 初值对调，但同页代码及“初始为空”的题设说明应为空位 1000、产品 0。本项目按题设处理。
- 检索到的 2022 年早期机构回忆材料存在题号互换和约束表述差异，未作为题号与前驱边的依据；以两份完整年度转载的一致内容为准。
- 2011 银行题给出显式保存票号和逐顾客通知的握手版，避免隐含假设任意信号量都严格按票号唤醒。它不是最少信号量版，原题未要求最少。
- 2017 题使用读写冲突对之间的三把锁，保留两个只读线程的并发，不把局部变量当共享资源。
- 2019 中取筷子许可上限与实际同时进餐上限区分；仅承诺本方案避免循环等待死锁，不把它描述为无饥饿证明。
- 2021 的开关中断方法按单处理机抽象分析，不外推成多核互斥算法。
- 2024 的两个小问分别初始化信号量；一次性写读不直接推广到循环缓冲区。
- 2025 容量约束指未填的坑，乙填土后归还坑位；水桶只有丙使用，无需互斥量。
- 自编选择检查用于确认关键概念，与原题小问明确分开；主观答案采用人工对照自查。
