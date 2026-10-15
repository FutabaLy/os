import { Composition, Folder } from "remotion";
import { OperatingSystem } from "./OperatingSystem";
import { Opening } from "./Opening";
import { Layers } from "./Layers";
import { Scheduling } from "./Scheduling";
import { Memory } from "./Memory";
import { Files } from "./Files";
import { Devices } from "./Devices";
import { Security } from "./Security";
import { Closing } from "./Closing";
export const RemotionRoot = () => (
  <>
    <Composition
      id="OperatingSystem"
      component={OperatingSystem}
      durationInFrames={4770}
      fps={30}
      width={1920}
      height={1080}
    />
    <Folder name="Scenes">
      <Composition
        id="Opening"
        component={Opening}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Layers"
        component={Layers}
        durationInFrames={570}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scheduling"
        component={Scheduling}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Memory"
        component={Memory}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Files"
        component={Files}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Devices"
        component={Devices}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Security"
        component={Security}
        durationInFrames={630}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Closing"
        component={Closing}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
