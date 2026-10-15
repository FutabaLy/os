import { useCurrentFrame, interpolate } from "remotion";
import { Scene, Chip, Panel, Label, green } from "./Visuals";
export const Opening = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      chapter="01 / INTRODUCTION"
      title="电脑背后的指挥系统"
      english="MEET THE OPERATING SYSTEM"
      duration={16}
      note="操作系统：管理硬件资源，为应用程序提供服务的系统软件。"
    >
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <ellipse
          cx="960"
          cy="580"
          rx="640"
          ry="210"
          fill="none"
          stroke={green}
          strokeOpacity=".3"
          strokeDasharray="5 12"
        />
        <ellipse
          cx="960"
          cy="580"
          rx="470"
          ry="270"
          fill="none"
          stroke={green}
          strokeOpacity=".15"
        />
      </svg>
      <Chip x={800} y={415} size={320} />
      {["浏览器", "音乐", "游戏", "文档"].map((name, i) => {
        const a = (i * Math.PI) / 2 + f / 450;
        return (
          <Panel
            key={name}
            x={960 + Math.cos(a) * 590 - 145}
            y={580 + Math.sin(a) * 190 - 55}
            w={290}
            h={110}
            style={{
              display: "grid",
              placeItems: "center",
              transform: `perspective(900px) rotateY(${-Math.cos(a) * 15}deg)`,
            }}
          >
            <Label>{name}</Label>
          </Panel>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 855,
          textAlign: "center",
          fontSize: 36,
          color: green,
          opacity: interpolate(f, [80, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        每一次点击，背后都有它在协调。
      </div>
    </Scene>
  );
};
