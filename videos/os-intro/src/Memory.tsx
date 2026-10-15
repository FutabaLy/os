import { useCurrentFrame } from "remotion";
import { Scene, Panel, Label, Flow, green, cyan, gold } from "./Visuals";
export const Memory = () => {
  const f = useCurrentFrame();
  const colors = [green, cyan, gold];
  return (
    <Scene
      chapter="04 / MEMORY"
      title="内存，是程序的工作台"
      english="STORAGE KEEPS. MEMORY WORKS."
      duration={21}
      note="内存保存运行中的数据，通常断电丢失；磁盘用于长期保存文件。"
    >
      <Panel x={160} y={390} w={430} h={350}>
        <Label style={{ margin: "35px 40px" }}>磁盘 / SSD</Label>
        <div
          style={{
            margin: "40px",
            fontSize: 34,
            lineHeight: 1.9,
            color: "#a8c1b2",
          }}
        >
          应用程序
          <br />
          照片与文档
          <br />
          长期保存
        </div>
      </Panel>
      <Flow points="610,560 900,560" />
      <div
        style={{
          position: "absolute",
          left: 670,
          top: 485,
          fontSize: 30,
          color: green,
        }}
      >
        加载
      </div>
      <Panel x={925} y={345} w={825} h={455}>
        <Label style={{ margin: "30px 40px" }}>内存 / RAM</Label>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 125,
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gap: 10,
          }}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 35,
                borderRadius: 5,
                background: i < 45 ? colors[Math.floor(i / 15)] : "#254233",
                opacity:
                  i < 45 ? 0.5 + 0.45 * Math.sin(f / 30 + i / 5) ** 2 : 0.4,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 30,
            fontSize: 27,
            color: "#a8c1b2",
          }}
        >
          系统为运行中的程序分配、管理内存。
        </div>
      </Panel>
      <div
        style={{
          position: "absolute",
          left: 950,
          top: 830,
          display: "flex",
          gap: 50,
          fontSize: 26,
        }}
      >
        {["音乐", "浏览器", "游戏"].map((s, i) => (
          <div key={s} style={{ color: colors[i] }}>
            ■ {s}
          </div>
        ))}
      </div>
    </Scene>
  );
};
