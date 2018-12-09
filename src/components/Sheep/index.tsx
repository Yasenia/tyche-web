import * as React from "react";

import * as styles from "./index.scss";

const Sheep: React.FunctionComponent<any> = () => {
  return (
    <>
      <div className={styles.runningSheep}/>
      <div className={styles.strugglingSheep}/>
    </>
  );
};

export default Sheep;
