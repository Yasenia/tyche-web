import * as React from "react";

import {Sheep} from "../../types/sheep";

import * as styles from "./index.scss";

interface IProps {
  flock: Sheep[];
}

interface IState {
  flockState: {
    [sheepId: string]: {
      x: number;
      y: number;
      z: number;
    };
  };
}

class Sheepfold extends React.PureComponent<IProps, IState> {

  public constructor(props: IProps) {
    super(props);
    this.state = { flockState: {} };
    this.props.flock.forEach((sheep) => {
      this.state.flockState[sheep.id] = {
        x: Math.random() * 600,
        y: 300,
        z: Math.random() * 10,
      };
    });
  }

  public render() {
    const {flock} = this.props;
    return (
      <div className={styles.sheepfold}>
        {flock.map(this.renderSheep)}
      </div>
    );
  }

  private renderSheep = (sheep: Sheep) => {
    const {flockState} = this.state;
    const sheepState = flockState[sheep.id];
    return (<div
      key={sheep.id}
      className={styles.sheep}
      style={{
        left: sheepState.x,
        top: sheepState.y,
        zIndex: sheepState.z,
      }}
    />);
  }

}

export default Sheepfold;
