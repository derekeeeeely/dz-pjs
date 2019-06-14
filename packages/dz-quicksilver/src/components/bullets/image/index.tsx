import * as _ from 'lodash';
import * as React from 'react';

export default (props: any) => {
  const { url = 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' } = props
  return (
    <div>
      <img src={url} style={{ width: '100%' }} />
    </div>
  )
};
