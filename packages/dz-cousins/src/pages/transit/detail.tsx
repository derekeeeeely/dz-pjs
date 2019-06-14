import * as React from 'react';
import EkkoEditTable from '@/components/EkkoEditTable';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import { connect } from 'dva';
import {
  getVersionFormConfig,
  getEnvVariableTableConfig,
  getCommonVariableTableConfig,
} from './config';

const namespace = 'transit.detail';
function VersionDetail(props: any) {
  // 区分编辑、查看、新增
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 保存协议基础信息
  const handleSaveBasic = values => {
    console.log(values);
  };

  // 保存协议脚本
  const handleSaveScript = values => {
    console.log(values);
  };

  // 保存通用变量配置
  const handleSaveCommonVariable = values => {
    console.log(values);
  };

  // 保存环境变量配置
  const handleSaveEnvVariable = values => {
    console.log(values);
  };

  return (
    <EkkoPanel>
      <h2>协议信息</h2>
      <EkkoForm
        ekkotag={`${namespace}.basic`}
        columns={getVersionFormConfig(id)}
        onSave={handleSaveBasic}
        disabled={disabled}
      />
      <h2>协议变量</h2>
      <h3>通用变量</h3>
      <EkkoEditTable
        columns={getCommonVariableTableConfig()}
        ekkotag={`${namespace}.variable.common`}
        onSave={handleSaveCommonVariable}
        disabled={disabled}
      />
      <h3>环境变量</h3>
      <EkkoEditTable
        columns={getEnvVariableTableConfig()}
        ekkotag={`${namespace}.variable.env`}
        onSave={handleSaveEnvVariable}
        disabled={disabled}
      />
      <h2>协议脚本</h2>
      <EkkoForm
        ekkotag={`${namespace}.script`}
        columns={[{ datakey: 'script', type: 'textarea' }]}
        onSave={handleSaveScript}
        disabled={disabled}
      />
    </EkkoPanel>
  );
}

export default connect()(VersionDetail);
