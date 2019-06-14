import * as _ from 'lodash';
import * as React from 'react';
import AltFormItems from './item'
import './index.less'

export default (props: any) => {
  const { fields , layout } = props;
  return (
    <div className="alita-form">
      <AltFormItems fields={fields} layout={layout} disabled={true} />
    </div>
  )
};
