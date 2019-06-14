import * as React from 'react';
import { Button } from 'antd';
const styles = require('./index.less');

export default function EkkoButton(props: any) {
  const { title } = props;
  return (
    <Button {...props} className={styles['ekko-button']}>
      {title}
    </Button>
  );
}
