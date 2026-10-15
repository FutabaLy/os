import { useCurrentFrame } from "remotion";
import { Scene, Chip, green, cyan } from "./Visuals";
export const Closing = () => {
  const f = useCurrentFrame();
  return (
    <Scene
      chapter="08 / ONE IDEA TO REMEMBER"
      title="让硬件协作，让软件运行"
      english="DIFFERENT SYSTEMS. A SHARED RESPONSIBILITY."
      duration={18}
      note="记住：操作系统管理资源、提供服务，让你和应用更方便地使用设备。"
    >
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        {Array.from({ length: 180 }, (_, i) => {
          const lat = Math.acos(1 - (2 * (i + 0.5)) / 180),
            lon = i * 2.39996 + f / 170;
          const x = Math.sin(lat) * Math.cos(lon),
            z = Math.sin(lat) * Math.sin(lon),
            y = Math.cos(lat);
          return (
            <circle
              key={i}
              cx={960 + x * 410}
              cy={575 + y * 270}
              r={z > 0 ? 3.5 : 2}
              fill={i % 8 === 0 ? cyan : green}
              opacity={0.2 + (z + 1) * 0.3}
            />
          );
        })}
        <ellipse
          cx="960"
          cy="575"
          rx="540"
          ry="250"
          fill="none"
          stroke={green}
          strokeOpacity=".2"
        />
      </svg>
      <Chip x={835} y={450} size={250} />
      {["Windows", "macOS", "Linux", "Android", "iOS"].map((v, i) => {
        const a = (i * Math.PI * 2) / 5 - 0.4;
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: 960 + Math.cos(a) * 650 - 150,
              top: 570 + Math.sin(a) * 220 - 30,
              width: 300,
              textAlign: "center",
              fontSize: 44,
              fontWeight: 600,
              color: i % 2 ? cyan : green,
              textShadow: "0 0 25px #78ffaf50",
            }}
          >
            {v}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 28,
          letterSpacing: 8,
          color: "#9cbdab",
        }}
      >
        调度{"\u3000"}·{"\u3000"}内存{"\u3000"}·{"\u3000"}文件{"\u3000"}·
        {"\u3000"}设备{"\u3000"}·{"\u3000"}权限
      </div>
    </Scene>
  );
};
