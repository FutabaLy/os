import { useCurrentFrame } from "remotion";
import { Scene, Panel, Label, Flow, green, cyan } from "./Visuals";
export const Layers = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      chapter="02 / THE BRIDGE"
      title="软件与硬件之间的桥梁"
      english="APPLICATION → OPERATING SYSTEM → HARDWARE"
      duration={19}
      note="应用提出需求，系统协调资源；内核是操作系统的核心部分。"
    >
      <Flow points="580,420 580,760" />
      <Flow points="960,420 960,760" delay={0.3} />
      <Flow points="1340,420 1340,760" delay={0.6} />
      <Panel
        x={370}
        y={340}
        w={1180}
        h={120}
        accent={cyan}
        style={{
          transform: `perspective(1600px) rotateY(${Math.sin(f / 100) * 4}deg)`,
        }}
      >
        <Label color={cyan} style={{ textAlign: "center", marginTop: 29 }}>
          浏览器{"\u3000"}
          {"\u3000"}播放器{"\u3000"}
          {"\u3000"}游戏{"\u3000"}
          {"\u3000"}编辑器
        </Label>
      </Panel>
      <Panel x={300} y={515} w={1320} h={145}>
        <Label style={{ margin: "28px 45px" }}>
          操作系统{" "}
          <span style={{ fontSize: 28, color: "#aecab9", marginLeft: 45 }}>
            调度 · 内存 · 文件 · 设备 · 权限
          </span>
        </Label>
        <div
          style={{
            position: "absolute",
            height: 4,
            left: 45,
            right: 45,
            bottom: 20,
            background:
              "linear-gradient(90deg,transparent,#78ffaf,transparent)",
          }}
        />
      </Panel>
      <Panel x={370} y={715} w={1180} h={120}>
        <Label style={{ textAlign: "center", marginTop: 29 }}>
          CPU{"\u3000"}
          {"\u3000"}内存{"\u3000"}
          {"\u3000"}磁盘{"\u3000"}
          {"\u3000"}键盘与屏幕
        </Label>
      </Panel>
      <div
        style={{
          position: "absolute",
          left: 115,
          top: 380,
          color: cyan,
          fontSize: 26,
        }}
      >
        应用层
      </div>
      <div
        style={{
          position: "absolute",
          left: 115,
          top: 570,
          color: green,
          fontSize: 26,
        }}
      >
        系统层
      </div>
      <div
        style={{
          position: "absolute",
          left: 115,
          top: 755,
          color: green,
          fontSize: 26,
        }}
      >
        硬件层
      </div>
    </Scene>
  );
};
