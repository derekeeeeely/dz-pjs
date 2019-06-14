import * as React from 'react';
import router from 'umi/router';
import EkkoButton from '@/components/EkkoButton';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import { connect } from 'dva';
import { getDetailFormConfig } from '../config/detail';

const namespace = 'interfaces.detail.basic';
function VersionBasic(props: any) {
  // 区分新增、编辑、查看
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 基础信息保存
  const handleSave = values => {
    console.log(values);
  };

  // 下一步
  const goNext = () => {
    const target = {
      pathname: `/interfaces/version/rr/${id}`,
      query: { mode },
    };
    router.push(target);
  };

  return (
    <EkkoPanel>
      <h2>基本信息</h2>
      <EkkoForm
        ekkotag={`${namespace}.form`}
        columns={getDetailFormConfig(id)}
        onSave={handleSave}
        disabled={disabled}
      />
      <EkkoButton title="下一步" type="primary" onClick={goNext} />
    </EkkoPanel>
  );
}

export default connect()(VersionBasic);
