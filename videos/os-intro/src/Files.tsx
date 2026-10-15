import { useCurrentFrame } from "remotion";
import { Scene, Panel, Label, Flow, green, cyan } from "./Visuals";
export const Files = () => {
  const f = useCurrentFrame();
  const cycle = f % 240;
  const saved = cycle > 120;
  return (
    <Scene
      chapter="05 / FILE SYSTEM"
      title="按下保存，数据去了哪里？"
      english="FROM YOUR DOCUMENT TO PERSISTENT STORAGE"
      duration={21}
      note="文件系统组织文件、目录与存储位置；保存让修改进入持久存储流程。"
    >
      <Panel x={145} y={355} w={510} h={460} accent={cyan}>
        <div
          style={{
            background: "#70dcff15",
            padding: "22px 28px",
            fontSize: 27,
            color: cyan,
          }}
        >
          笔记.txt{" "}
          <span style={{ float: "right" }}>{saved ? "已保存" : "编辑中"}</span>
        </div>
        <div style={{ padding: 35, fontSize: 36, lineHeight: 1.9 }}>
          今天学会了：
          <br />
          <span style={{ color: green }}>
            {"操作系统管理资源。".slice(
              0,
              Math.min(10, Math.floor(cycle / 8) + 1),
            )}
          </span>
          <span style={{ opacity: f % 30 < 15 ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 35,
            bottom: 35,
            padding: "12px 28px",
            border: `1px solid ${cyan}`,
            borderRadius: 9,
            fontSize: 28,
            color: cyan,
          }}
        >
          Ctrl + S
        </div>
      </Panel>
      <Flow points="675,565 835,565" color={cyan} />
      <Panel x={860} y={445} w={370} h={235}>
        <Label style={{ textAlign: "center", paddingTop: 40 }}>文件系统</Label>
        <Label
          small
          style={{ textAlign: "center", marginTop: 25, color: "#b7cebf" }}
        >
          目录 / 名称 / 位置
        </Label>
      </Panel>
      <Flow points="1250,565 1390,565" delay={0.45} />
      <Panel x={1410} y={365} w={365} h={430}>
        <Label style={{ padding: "35px 35px 15px" }}>磁盘</Label>
        {["文档", "  └ 笔记.txt", "照片", "  └ 旅行.jpg"].map((v, i) => (
          <div
            key={v}
            style={{
              margin: "22px 35px",
              fontSize: 30,
              color: i === 1 && saved ? green : "#8caa98",
              background: i === 1 && saved ? "#78ffaf12" : "transparent",
            }}
          >
            {v}
          </div>
        ))}
      </Panel>
    </Scene>
  );
};
