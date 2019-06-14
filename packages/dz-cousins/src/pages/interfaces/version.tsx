import * as React from 'react';
import router from 'umi/router';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoTable from '@/components/EkkoTable';
import EkkoButton from '@/components/EkkoButton';
import { connect } from 'dva';
import { getVersionFormConfig, getVersionTableConfig } from './config';

const namespace = 'interfaces.version';
const { useEffect } = React;
function Version(props: any) {
  const { dispatch } = props;
  const { id } = props.computedMatch.params;

  // 获取版本列表数据
  const getVersionData = () => {
    dispatch({
      type: 'global/getData',
      api: '/api/interfaces/version/list',
      payload: { id },
      ekkotag: `${namespace}.table`,
    });
  };

  // 初次进入页面获取版本列表数据
  useEffect(getVersionData, []);

  // 创建新接口-跳转到新增
  const handleAdd = () => {
    router.push('/interfaces/version/basic/add');
  };

  return (
    <EkkoPanel>
      <h1>接口版本信息</h1>
      <h2>基本信息</h2>
      <EkkoForm ekkotag={`${namespace}.basic`} columns={getVersionFormConfig(id)} />
      <h2>版本列表</h2>
      <EkkoButton title="创建新接口" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={getVersionTableConfig(id)} />
    </EkkoPanel>
  );
}

export default connect()(Version);
