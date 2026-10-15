import { useCurrentFrame } from "remotion";
import { Scene, Chip, Panel, Label, Flow, green, cyan, gold } from "./Visuals";
export const Scheduling = () => {
  const f = useCurrentFrame();
  const active = Math.floor(f / 45) % 3;
  const names = ["播放音乐", "加载网页", "运行游戏"];
  const colors = [green, cyan, gold];
  return (
    <Scene
      chapter="03 / CPU SCHEDULING"
      title="大家都要用 CPU，怎么办？"
      english="TAKE TURNS. KEEP THINGS MOVING."
      duration={22}
      note="单核快速切换任务，形成并发；多个核心还可以真正并行执行。"
    >
      {names.map((n, i) => (
        <Panel
          key={n}
          x={155}
          y={340 + i * 145}
          w={460}
          h={115}
          accent={colors[i]}
          style={{
            opacity: active === i ? 1 : 0.45,
            translate: active === i ? "25px 0" : "0 0",
          }}
        >
          <Label color={colors[i]} style={{ margin: "22px 32px" }}>
            {n}
            <span style={{ float: "right", fontSize: 23, paddingTop: 13 }}>
              {active === i ? "执行中" : "等待中"}
            </span>
          </Label>
        </Panel>
      ))}
      <Flow
        points={`640,${397 + active * 145} 790,${397 + active * 145} 790,535 970,535`}
        color={colors[active]}
      />
      <Chip x={1000} y={355} size={330} text="CPU" />
      <div
        style={{
          position: "absolute",
          left: 1430,
          top: 420,
          fontSize: 34,
          lineHeight: 1.8,
          color: "#a8c1b2",
        }}
      >
        操作系统
        <br />
        <span style={{ color: colors[active], fontSize: 52 }}>分配时间</span>
        <br />
        让任务轮流执行
      </div>
      <div
        style={{
          position: "absolute",
          left: 155,
          top: 825,
          fontSize: 24,
          color: "#a8c1b2",
        }}
      >
        单核时间片示意
      </div>
      <div
        style={{
          position: "absolute",
          left: 445,
          top: 785,
          display: "flex",
          gap: 9,
        }}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 78,
              height: 75,
              borderRadius: 8,
              background: colors[i % 3],
              opacity: i <= Math.floor(f / 10) % 15 ? 0.85 : 0.14,
              display: "grid",
              placeItems: "center",
              fontSize: 28,
              color: "#07130c",
            }}
          >
            {["音", "网", "游"][i % 3]}
          </div>
        ))}
      </div>
    </Scene>
  );
};
