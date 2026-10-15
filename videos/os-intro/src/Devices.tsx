import { useCurrentFrame } from "remotion";
import { Scene, Panel, Label, Flow, green, cyan } from "./Visuals";
export const Devices = () => {
  const f = useCurrentFrame();
  const ch = "HELLO OS".slice(0, Math.floor(f / 24) % 9);
  return (
    <Scene
      chapter="06 / DEVICE DRIVERS"
      title="设备各不相同，系统如何沟通？"
      english="DRIVERS CONNECT THE HARDWARE"
      duration={21}
      note="驱动程序帮助操作系统控制具体设备，应用通过系统处理输入与输出。"
    >
      <Panel x={140} y={420} w={480} h={320}>
        <Label style={{ padding: "28px 32px" }}>键盘输入</Label>
        <div
          style={{
            padding: "12px 30px",
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gap: 8,
          }}
        >
          {"QWERTYUIASDFGHJKZXCVBNM ".split("").map((v, i) => (
            <div
              key={i}
              style={{
                height: 49,
                borderRadius: 6,
                border: "1px solid #78ffaf50",
                background: i === Math.floor(f / 12) % 24 ? green : "#0f251a",
                color: i === Math.floor(f / 12) % 24 ? "#031008" : green,
                display: "grid",
                placeItems: "center",
                fontSize: 24,
              }}
            >
              {v}
            </div>
          ))}
        </div>
      </Panel>
      <Flow points="640,565 765,565" />
      <Panel x={790} y={420} w={350} h={320}>
        <Label style={{ textAlign: "center", paddingTop: 50 }}>
          驱动 + 系统
        </Label>
        <div
          style={{
            textAlign: "center",
            fontSize: 28,
            color: "#a8c1b2",
            marginTop: 30,
            lineHeight: 1.8,
          }}
        >
          识别设备信号
          <br />
          提供统一服务
        </div>
      </Panel>
      <Flow points="1160,565 1285,565" delay={0.5} color={cyan} />
      <Panel x={1310} y={365} w={455} h={385} accent={cyan}>
        <div
          style={{
            height: 48,
            background: "#70dcff20",
            fontSize: 22,
            padding: "12px 22px",
            color: cyan,
          }}
        >
          APPLICATION / 文本编辑器
        </div>
        <div
          style={{
            fontSize: 46,
            margin: "65px 30px",
            fontFamily: "Consolas,monospace",
            color: cyan,
          }}
        >
          {ch}
          <span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>▌</span>
        </div>
      </Panel>
      <div
        style={{
          position: "absolute",
          left: 1430,
          top: 770,
          width: 215,
          height: 12,
          background: "#70dcff60",
          borderRadius: 10,
        }}
      />
    </Scene>
  );
};
