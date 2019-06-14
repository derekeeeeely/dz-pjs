import * as _ from 'lodash';
import * as React from 'react';
import { Card } from 'antd';

export default (props: any) => {
  const { title = 'I am card', content = 'drag me' } = props;
  return (
    <div>
      <Card title={title}>
        {content}
      </Card>
    </div>
  )
};

