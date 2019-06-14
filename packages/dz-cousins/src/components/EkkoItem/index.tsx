import { get } from 'lodash';
import { connect } from 'dva';
import warehouse from './warehouse';

interface ItemProps {
  type: any;
  initialValue?: any;
  render?: (props: any) => any;
  ekkotag: string;
  data: any;
  value?: any;
  mode?: any;
  inStore?: boolean;
}

function EkkoItem(props: ItemProps) {
  const { ekkotag, data, inStore } = props;
  const itemProps = { ...props };

  // inStore表示需要存放到store中
  // form默认不存放
  // 而是在父组件中通过state流转
  if (inStore) {
    itemProps.value = get(data, ekkotag);
  }

  if (props.render) {
    return props.render(itemProps);
  }
  return warehouse[props.type].renderFn(itemProps);
}

export default connect(({ global }) => ({ data: global }))(EkkoItem);
