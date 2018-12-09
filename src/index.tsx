import * as React from "react";
import * as ReactDOM from "react-dom";
import SheepAnimation from "./components/SheepAnimation";
import {Sheep, SheepStatus} from "./types/sheep";

ReactDOM.render(
  <>
    <SheepAnimation sheep={{status: SheepStatus.FREE} as Sheep}/>
    <SheepAnimation sheep={{status: SheepStatus.CAUGHT} as Sheep}/>
  </>,
  document.getElementById("root") as HTMLElement,
);
