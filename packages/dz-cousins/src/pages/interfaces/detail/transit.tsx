import * as React from 'react';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoButton from '@/components/EkkoButton';
import EkkoEditTable from '@/components/EkkoEditTable';
import EkkoForm from '@/components/EkkoForm';
import { connect } from 'dva';
import { transitVariableTableConfig, transitProtocolFormConfig } from '../config/detail';

const namespace = 'interfaces.detail.transit';
function VersionTransit(props: any) {
  // 用于区分新增、编辑、查看
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 下一步
  const goNext = () => {
    const target = {
      pathname: `/interfaces/version/data/${id}`,
      query: { mode },
    };
    router.push(target);
  };

  // 转发协议保存
  const handleSaveProtocol = values => {
    console.log(values);
  };

  // 协议变量配置保存
  const handleSaveVariable = values => {
    console.log(values);
  };

  return (
    <EkkoPanel>
      <h2>转发协议选择</h2>
      <EkkoForm
        ekkotag={`${namespace}.protocol`}
        columns={transitProtocolFormConfig}
        onSave={handleSaveProtocol}
        disabled={disabled}
      />
      <h2>协议变量配置</h2>
      <EkkoEditTable
        columns={transitVariableTableConfig}
        ekkotag={`${namespace}.variable`}
        onSave={handleSaveVariable}
        disabled={disabled}
      />
      <EkkoButton title="下一步" type="primary" onClick={goNext} />
    </EkkoPanel>
  );
}

export default connect()(VersionTransit);
