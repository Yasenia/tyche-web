import * as React from "react";
import * as ReactDOM from "react-dom";

const Hello: React.FunctionComponent<{ name: string }> = ({name}) => (<div>Hello {name}!</div>);

ReactDOM.render(
  <Hello name="tyche"/>,
  document.getElementById("root") as HTMLElement,
);
