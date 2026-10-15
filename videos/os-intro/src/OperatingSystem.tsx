import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Opening } from "./Opening";
import { Layers } from "./Layers";
import { Scheduling } from "./Scheduling";
import { Memory } from "./Memory";
import { Files } from "./Files";
import { Devices } from "./Devices";
import { Security } from "./Security";
import { Closing } from "./Closing";
export const OperatingSystem = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence
          name="01 操作系统是什么"
          durationInFrames={16 * fps}
          premountFor={fps}
        >
          <Opening />
        </Series.Sequence>
        <Series.Sequence
          name="02 软件与硬件"
          durationInFrames={19 * fps}
          premountFor={fps}
        >
          <Layers />
        </Series.Sequence>
        <Series.Sequence
          name="03 CPU 调度"
          durationInFrames={22 * fps}
          premountFor={fps}
        >
          <Scheduling />
        </Series.Sequence>
        <Series.Sequence
          name="04 内存"
          durationInFrames={21 * fps}
          premountFor={fps}
        >
          <Memory />
        </Series.Sequence>
        <Series.Sequence
          name="05 文件系统"
          durationInFrames={21 * fps}
          premountFor={fps}
        >
          <Files />
        </Series.Sequence>
        <Series.Sequence
          name="06 设备驱动"
          durationInFrames={21 * fps}
          premountFor={fps}
        >
          <Devices />
        </Series.Sequence>
        <Series.Sequence
          name="07 权限"
          durationInFrames={21 * fps}
          premountFor={fps}
        >
          <Security />
        </Series.Sequence>
        <Series.Sequence
          name="08 总结"
          durationInFrames={18 * fps}
          premountFor={fps}
        >
          <Closing />
        </Series.Sequence>
      </Series>
      <Audio src={staticFile("preview-audio.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
};
