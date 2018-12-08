import * as React from "react";
import * as styles from "./styles.scss";

const Hello: React.FunctionComponent<{name: string}> = ({name}) => {
  return (<div className={styles.hello} >Hello {name}!</div>);
};

export default Hello;
