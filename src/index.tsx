import * as React from "react";
import * as ReactDOM from "react-dom";
import GamePanel from "./containers/GamePanel";
import {Sheep} from "./types/sheep";
import {getStoredLuckySheep} from "./utils/storage";
import { participants } from "./data/participants";

const luckyFlock = getStoredLuckySheep();
const root = document.getElementById("root") as HTMLElement;
const flock = participants
  .map((name: string, index: number) => ({id: index.toString(), name}) as Sheep)
  .filter((p: {id: string}) => !luckyFlock.includes(p.id));

ReactDOM.render(
  <>
    <GamePanel
      flock={flock}
      barrierRange={{
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight / 2,
      }}
      prairieRange={{
        // left: 0,
        left: - window.innerWidth,
        top: window.innerHeight / 2,
        // right: window.innerWidth,
        right: window.innerWidth * 2,
        bottom: window.innerHeight,
      }}
    />
  </>, root,
);
