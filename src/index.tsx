import * as React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./components/Hello/index";

ReactDOM.render(
  <Hello name="tyche" />,
  document.getElementById("root") as HTMLElement,
);
