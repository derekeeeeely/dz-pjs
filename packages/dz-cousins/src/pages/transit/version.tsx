import * as React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoTable from '@/components/EkkoTable';
import EkkoButton from '@/components/EkkoButton';
import { getVersionFormConfig, getVersionTableConfig } from './config';

const namespace = 'transit.version';
const { useEffect } = React;
function Version(props: any) {
  const { dispatch } = props;
  // 区分查看、新增
  const { id } = props.computedMatch.params;

  // 获取协议详情信息
  const getVersionData = () => {
    dispatch({
      type: 'global/getData',
      api: '/api/transit/version/list',
      payload: { id },
      ekkotag: `${namespace}.table`,
    });
  };

  // 初次进入页面获取协议详情
  useEffect(getVersionData, []);

  // 创建新版本--跳转到版本新建
  const handleAdd = () => {
    router.push('/transit/version/add');
  };

  return (
    <EkkoPanel>
      <h1>转发协议详情</h1>
      <h2>基本信息</h2>
      <EkkoForm ekkotag={`${namespace}.basic`} columns={getVersionFormConfig(id)} />
      <h2>版本列表</h2>
      <EkkoButton title="创建新版本" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={getVersionTableConfig(id)} />
    </EkkoPanel>
  );
}

export default connect()(Version);
