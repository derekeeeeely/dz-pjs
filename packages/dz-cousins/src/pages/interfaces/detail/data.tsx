import * as React from 'react';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoButton from '@/components/EkkoButton';
import EkkoForm from '@/components/EkkoForm';
import { connect } from 'dva';
import { transitProtocolFormConfig } from '../config/detail';

const namespace = 'interfaces.detail.data';
function VersionData(props: any) {
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 下一步
  const goNext = () => {
    const target = {
      pathname: `/interfaces/version/env/${id}`,
      query: { mode },
    };
    router.push(target);
  };

  return (
    <EkkoPanel>
      <h2>转发协议选择</h2>
      <EkkoForm ekkotag={`${namespace}.protocol`} columns={transitProtocolFormConfig} disabled />
      <h2>请求参数适配</h2>
      <h2>响应值适配</h2>
      <EkkoButton title="下一步" type="primary" onClick={goNext} />
    </EkkoPanel>
  );
}

export default connect()(VersionData);
