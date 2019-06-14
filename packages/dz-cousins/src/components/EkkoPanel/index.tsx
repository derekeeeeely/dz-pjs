import * as React from 'react';
const styles = require('./index.less');

export default function EkkoPanel(props: any) {
  return <div className={styles['ekko-panel']}>{props.children}</div>;
}
