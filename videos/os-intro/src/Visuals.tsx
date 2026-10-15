import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const green = "#78ffaf";
export const cyan = "#70dcff";
export const gold = "#ffd982";
export const font = '"Microsoft YaHei", "Segoe UI", sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  children?: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, children, accent = green, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      border: `1px solid ${accent}80`,
      borderRadius: 18,
      background: "linear-gradient(135deg,#102920ed,#040d0bed)",
      boxShadow: `0 0 35px ${accent}10,inset 0 0 35px ${accent}08`,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  small?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, small, color = green, style }) => (
  <div
    style={{
      fontSize: small ? 24 : 46,
      fontWeight: small ? 400 : 600,
      color,
      letterSpacing: small ? 3 : 1,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  text?: string;
}> = ({ x = 785, y = 390, size = 350, text = "OS" }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        border: `2px solid ${green}`,
        borderRadius: 28,
        background: "radial-gradient(circle,#174c36,#04120c 72%)",
        boxShadow: `0 0 ${45 + 15 * Math.sin(f / 24)}px #78ffaf30,inset 0 0 45px #78ffaf18`,
        transform: `perspective(1300px) rotateY(${Math.sin(f / 90) * 8}deg) rotateX(8deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 18,
          border: "1px solid #78ffaf40",
          borderRadius: 16,
        }}
      />
      <div
        style={{
          fontSize: size * 0.32,
          fontWeight: 700,
          letterSpacing: 4,
          textShadow: "0 0 35px #78ffaf80",
        }}
      >
        {text}
      </div>
      {Array.from({ length: 8 }, (_, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              position: "absolute",
              left: -21,
              top: 35 + (i * (size - 70)) / 7,
              width: 20,
              height: 8,
              background: green,
              opacity: 0.45,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -21,
              top: 35 + (i * (size - 70)) / 7,
              width: 20,
              height: 8,
              background: green,
              opacity: 0.45,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export const Flow: React.FC<{
  points: string;
  color?: string;
  delay?: number;
}> = ({ points, color = green, delay = 0 }) => {
  const f = useCurrentFrame();
  const pts = points.split(" ").map((p) => p.split(",").map(Number));
  const p = (((f / 85 + delay) % 1) + 1) % 1;
  const index = Math.min(pts.length - 2, Math.floor(p * (pts.length - 1)));
  const t = p * (pts.length - 1) - index;
  const a = pts[index],
    b = pts[index + 1];
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: 1920,
        height: 1080,
        overflow: "visible",
      }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity=".3"
      />
      <circle
        cx={a[0] + (b[0] - a[0]) * t}
        cy={a[1] + (b[1] - a[1]) * t}
        r="7"
        fill={color}
        style={{ filter: `drop-shadow(0 0 9px ${color})` }}
      />
    </svg>
  );
};

export const Scene: React.FC<{
  chapter: string;
  title: string;
  english: string;
  note: string;
  children: React.ReactNode;
  duration: number;
}> = ({ chapter, title, english, note, children, duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: "#020806",
        color: "#edfff4",
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%,#123b273d,transparent 66%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "linear-gradient(#58ed9a25 1px,transparent 1px),linear-gradient(90deg,#58ed9a25 1px,transparent 1px)",
          backgroundSize: "90px 90px",
          transform: `perspective(700px) rotateX(62deg) translateY(${250 + (f % 90)}px) scale(2)`,
          transformOrigin: "50% 100%",
        }}
      />
      {Array.from({ length: 65 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i * 379.13) % 1920,
            top:
              (((i * 179.7 - f * (0.07 + (i % 4) * 0.04)) % 1080) + 1080) %
              1080,
            width: i % 6 === 0 ? 4 : 2,
            height: i % 6 === 0 ? 4 : 2,
            borderRadius: 10,
            background: green,
            opacity: 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(f / 40 + i)),
            boxShadow: "0 0 10px #78ffaf",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 60,
          fontSize: 23,
          letterSpacing: 5,
          color: "#89b69d",
        }}
      >
        SYSTEM NOTES{" "}
        <span style={{ color: green, marginLeft: 22 }}> / {chapter}</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 60,
          fontSize: 22,
          letterSpacing: 3,
          color: "#89b69d",
        }}
      >
        计算机入门 · 操作系统
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 130,
          opacity: interpolate(f, [0, fps * 0.8], [0, 1], clamp),
          translate: `0 ${interpolate(f, [0, fps], [25, 0], clamp)}px`,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: 4,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 7,
            color: green,
            marginTop: 18,
          }}
        >
          {english}
        </div>
      </div>
      <AbsoluteFill
        style={{
          opacity: interpolate(
            f,
            [0, fps * 0.8, duration * fps - fps * 0.5, duration * fps],
            [0, 1, 1, 0],
            clamp,
          ),
        }}
      >
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          bottom: 90,
          borderTop: "1px solid #78ffaf35",
          paddingTop: 24,
          fontSize: 34,
          lineHeight: 1.5,
          color: "#d0e6d8",
        }}
      >
        {note}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${(100 * f) / (duration * fps)}%`,
          height: 3,
          background: green,
          boxShadow: "0 0 12px #78ffaf",
        }}
      />
    </AbsoluteFill>
  );
};
