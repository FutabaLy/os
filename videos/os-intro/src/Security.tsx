import { useCurrentFrame } from "remotion";
import { Scene, Panel, Label, Flow, green, gold } from "./Visuals";
export const Security = () => {
  const f = useCurrentFrame();
  const denied = Math.floor(f / 120) % 2 === 0;
  return (
    <Scene
      chapter="07 / PERMISSIONS"
      title="不是每个程序，都能做所有事"
      english="ISOLATE PROCESSES. CHECK ACCESS."
      duration={21}
      note="权限和进程隔离限制访问范围、减少相互干扰；它们不代表绝对安全。"
    >
      <Panel x={170} y={395} w={420} h={380}>
        <Label style={{ padding: "40px" }}>普通应用</Label>
        <div
          style={{
            margin: "10px 40px",
            border: "1px dashed #78ffaf50",
            height: 175,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            color: "#acc7b7",
            fontSize: 32,
          }}
        >
          独立运行空间
        </div>
      </Panel>
      <Flow points="610,585 810,585" color={denied ? gold : green} />
      <svg
        style={{
          position: "absolute",
          left: 825,
          top: 375,
          width: 275,
          height: 385,
        }}
        viewBox="0 0 275 385"
      >
        <path
          d="M137 15 L260 70 V210 Q240 320 137 365 Q34 320 15 210 V70 Z"
          fill="#0b2c1d"
          stroke={denied ? gold : green}
          strokeWidth="3"
        />
        <text
          x="137"
          y="170"
          textAnchor="middle"
          fill={denied ? gold : green}
          fontSize="40"
        >
          权限检查
        </text>
        <text
          x="137"
          y="235"
          textAnchor="middle"
          fill={denied ? gold : green}
          fontSize="33"
        >
          {denied ? "拒绝访问" : "允许访问"}
        </text>
      </svg>
      {!denied && <Flow points="1120,585 1330,585" />}
      <Panel x={1360} y={395} w={390} h={380} accent={denied ? gold : green}>
        <Label color={denied ? gold : green} style={{ padding: "40px 30px" }}>
          {denied ? "受保护文件" : "授权文件"}
        </Label>
        <div
          style={{
            margin: "20px 30px",
            fontSize: 30,
            color: "#a8c1b2",
            lineHeight: 1.8,
          }}
        >
          {denied ? "缺少所需权限" : "具备所需权限"}
          <br />
          {denied ? "不能任意读取" : "在授权范围内操作"}
        </div>
      </Panel>
      <div
        style={{
          position: "absolute",
          left: 740,
          top: 820,
          fontSize: 28,
          color: "#a8c1b2",
        }}
      >
        访问前，先检查身份与权限。
      </div>
    </Scene>
  );
};
