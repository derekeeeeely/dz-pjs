import * as React from 'react';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoEditTable from '@/components/EkkoEditTable';
import EkkoButton from '@/components/EkkoButton';
import { connect } from 'dva';
import {
  getRequestTableConfig,
  getResponseTableConfig,
  getErrorTableConfig,
} from '../config/detail';

const namespace = 'interfaces.detail.rr';
function VersionRR(props: any) {
  // 用于区分新增、编辑、查看
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 请求参数保存
  const handleSaveRequest = values => {
    console.log(values);
  };

  // 响应参数保存
  const handleSaveResponse = values => {
    console.log(values);
  };

  // 异常码保存
  const handleSaveError = values => {
    console.log(values);
  };

  // 下一步
  const goNext = () => {
    const target = {
      pathname: `/interfaces/version/transit/${id}`,
      query: { mode },
    };
    router.push(target);
  };

  return (
    <EkkoPanel>
      <h2>应用级请求参数</h2>
      <EkkoEditTable
        columns={getRequestTableConfig()}
        ekkotag={`${namespace}.request`}
        onSave={handleSaveRequest}
        disabled={disabled}
      />
      <h2>应用级响应参数</h2>
      <EkkoEditTable
        columns={getResponseTableConfig()}
        ekkotag={`${namespace}.response`}
        onSave={handleSaveResponse}
        disabled={disabled}
      />
      <h2>异常码</h2>
      <EkkoEditTable
        columns={getErrorTableConfig()}
        ekkotag={`${namespace}.error`}
        onSave={handleSaveError}
        disabled={disabled}
      />
      <EkkoButton title="下一步" type="primary" onClick={goNext} />
    </EkkoPanel>
  );
}

export default connect()(VersionRR);
