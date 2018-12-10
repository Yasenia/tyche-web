import * as React from "react";
import * as ReactDOM from "react-dom";
import Sheepfold from "./containers/Sheepfold";
import {Sheep} from "./types/sheep";

ReactDOM.render(
  <>
    <Sheepfold flock={[
      {id: "1"} as Sheep,
      {id: "2"} as Sheep,
      {id: "3"} as Sheep,
      {id: "4"} as Sheep,
      {id: "5"} as Sheep,
    ]} />
  </>,
  document.getElementById("root") as HTMLElement,
);
