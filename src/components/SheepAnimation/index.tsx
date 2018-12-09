import * as React from "react";
import {Sheep, SheepStatus} from "../../types/sheep";
import * as styles from "./index.scss";

const styleOfStatus = {
  [SheepStatus.FREE]: styles.runningSheep,
  [SheepStatus.CAUGHT]: styles.strugglingSheep,
};

const SheepAnimation: React.FunctionComponent<{ sheep: Sheep }> = ({sheep}) => (
  <div className={styleOfStatus[sheep.status]}/>
);

export default SheepAnimation;
