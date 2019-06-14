import * as React from 'react';
import EkkoEditTable from '@/components/EkkoEditTable';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import { connect } from 'dva';
import {
  getDetailFormConfig,
  getRequestTableConfig,
  getResponseTableConfig,
  getErrorTableConfig,
} from './config/detail';

const namespace = 'gateway.detail';
const { useEffect } = React;
function VersionDetail(props: any) {
  // 区分编辑、查看、新增
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 翻译数据
  const translateData = data => {
    return data;
  };

  // 获取数据
  const getDefaultData = () => {
    if (id !== 'add') {
      props.dispatch({
        type: 'global/getData',
        api: '/api/gateway/version/detail',
        payload: { id },
        ekkotag: `${namespace}`,
        translation: translateData,
      });
    }
  };

  // 进入页面获取数据
  useEffect(getDefaultData, []);

  // 保存协议基础信息
  const handleSaveBasic = values => {
    console.log(values);
  };

  // 保存脚本上传
  const handleSaveScript = values => {
    console.log(values);
  };

  // 保存请求参数配置
  const handleSaveRequest = values => {
    console.log(values);
  };

  // 保存响应参数配置
  const handleSaveResponse = values => {
    console.log(values);
  };

  // 保存异常参数配置
  const handleSaveError = values => {
    console.log(values);
  };

  return (
    <EkkoPanel>
      <h2>协议信息</h2>
      <EkkoForm
        ekkotag={`${namespace}.basic`}
        columns={getDetailFormConfig(id)}
        onSave={handleSaveBasic}
        disabled={disabled}
      />
      <h2>脚本上传</h2>
      <EkkoForm
        ekkotag={`${namespace}.script`}
        columns={[{ datakey: 'script', type: 'textarea' }]}
        onSave={handleSaveScript}
        disabled={disabled}
      />
      <h2>公共级请求响应配置</h2>
      <h3>公共请求参数</h3>
      <EkkoEditTable
        columns={getRequestTableConfig()}
        ekkotag={`${namespace}.request`}
        onSave={handleSaveRequest}
        disabled={disabled}
      />
      <h3>公共响应参数</h3>
      <EkkoEditTable
        columns={getResponseTableConfig()}
        ekkotag={`${namespace}.response`}
        onSave={handleSaveResponse}
        disabled={disabled}
      />
      <h3>异常码</h3>
      <EkkoEditTable
        columns={getErrorTableConfig()}
        ekkotag={`${namespace}.error`}
        onSave={handleSaveError}
        disabled={disabled}
      />
    </EkkoPanel>
  );
}

export default connect()(VersionDetail);
