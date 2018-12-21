import classnames from "classnames";
import * as React from "react";

import {Sheep} from "../../types/sheep";
import {GameModel, Range} from "./model";

import * as styles from "./index.scss";

const sheepStyles = [
  styles.sheep1,
  styles.sheep2,
  styles.sheep3,
  styles.sheep4,
  styles.sheep5,
  styles.sheep6,
  styles.sheep7,
  styles.sheep8,
];

const luckySheepStyle = [
  styles.luckySheep1,
  styles.luckySheep2,
  styles.luckySheep3,
  styles.luckySheep4,
  styles.luckySheep5,
  styles.luckySheep6,
  styles.luckySheep7,
  styles.luckySheep8,
];

const backgroundColors = [
  "#ABE8CC",
  "#ABE8E3",
  "#9AE1A6",
  "#9ADDE1",
  "#B4E8B8",
];

export interface GameProps {
  flock: Sheep[];
  prairieRange: Range;
  barrierRange: Range;
}

export interface GameState {
  sheepStateMap: {
    [key: string]: {
      x: number,
      y: number,
      z: number,
      display: boolean,
      showSheepName: boolean,
      reverse: boolean,
      luckySheep: boolean,
    },
  };
  themeIndex: number;
}

export default class GamePanel extends React.PureComponent<GameProps, GameState> {

  private readonly model: GameModel;

  private interval1: number;
  private interval2: number;

  constructor(props: GameProps) {
    super(props);
    this.model = new GameModel(props);
    this.state = {
      ...this.model.snapshot(),
      themeIndex: 0,
    };
  }

  public componentDidMount(): void {
    this.interval1 = setInterval(() => this.setState(this.model.snapshot()), 20);
    this.interval2 = setInterval(() => this.model.run(), 10);
  }

  public render() {
    const {flock, prairieRange, barrierRange} = this.props;
    return (
      <div className={styles.wrapper}
           onMouseUp={this.model.putDown}
           // onMouseLeave={this.model.putDown}
           onMouseMove={(event) => {
             this.model.dragTo(event.clientX, event.clientY);
             const clientY = event.clientY;
             const clientX = event.clientX;
             if (clientX > 0 && clientX < window.innerWidth && clientY > 0 && clientY < window.innerHeight) {
               this.model.dragTo(clientX, clientY);
             } else {
               this.model.dragTo(
                 Math.max(1, Math.min(clientX, window.innerWidth - 1)),
                 Math.max(1, Math.min(clientY, window.innerHeight - 1)),
               );
               this.model.putDown();
             }
           }}
           style={{backgroundColor: backgroundColors[this.state.themeIndex % backgroundColors.length]}}
      >
        <div className={styles.prairie}
             style={{
               left: prairieRange.left,
               top: prairieRange.top,
               width: prairieRange.right - prairieRange.left,
               height: prairieRange.bottom - prairieRange.top,
               backgroundColor: backgroundColors[this.state.themeIndex % backgroundColors.length],
             }}
        />
        <div className={styles.barrier}
             style={{
               left: barrierRange.left,
               top: barrierRange.top,
               width: barrierRange.right - barrierRange.left,
               height: barrierRange.bottom - barrierRange.top,
             }}
        />

        {this.model.isLuckyTime() ?
          <button
            className={styles.kickOff}
            onClick={() => {
              this.model.nextRound();
              this.setState((prevState) => ({
                themeIndex: (prevState.themeIndex + 1),
              }));
            }}
          >NEXT</button> :
          <button
            className={styles.kickOff}
            onClick={() => {
              this.model.kickOff();
            }}
          >GO!</button>
        }
        {flock.map(this.renderSheep)}
      </div>
    );
  }

  private renderSheep = (sheep: Sheep) => {
    const sheepState = this.state.sheepStateMap[sheep.id];
    return (
      !sheepState.luckySheep && <div
        key={sheep.id}
        className={classnames([
          styles.sheep,
          sheepState.showSheepName
            ? luckySheepStyle[this.state.themeIndex % luckySheepStyle.length]
            : sheepStyles[this.state.themeIndex % sheepStyles.length],
          sheepState.reverse && styles.reverse,
          sheepState.display || styles.sheepTransparent,
        ])}
        style={{
          left: sheepState.x,
          top: sheepState.y,
          zIndex: sheepState.z,
        }}
        onMouseDown={(event) => this.model.pickUp(sheep.id, event.clientX, event.clientY)}
      >
        <span>{sheepState.showSheepName && sheep.name}</span>
      </div>
    );
  }

}
