import * as React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import EkkoForm from '@/components/EkkoForm';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoTable from '@/components/EkkoTable';
import EkkoButton from '@/components/EkkoButton';
import EkkoEditTable from '@/components/EkkoEditTable';
import { Environment } from '@/utils/enums';
import { getVersionFormConfig, getVersionTableConfig, getStorageTableConfig } from './config';

const namespace = 'gateway.version';
const { useEffect } = React;
const { TabPane } = Tabs;
function Version(props: any) {
  // 区分查看、新增
  const { id } = props.computedMatch.params;

  // 翻译数据
  const translateData = data => {
    return data;
  };

  // 获取数据
  const getDefaultData = () => {
    if (id !== 'add') {
      props.dispatch({
        type: 'global/getData',
        api: '/api/gateway/version/list',
        payload: { id },
        ekkotag: `${namespace}.table`,
        translation: translateData,
      });
    }
  };

  // 进入页面获取数据
  useEffect(getDefaultData, []);

  // 创建新版本--跳转到版本新建
  const handleAdd = () => {
    router.push('/gateway/version/add');
  };

  // 版本存储保存
  const handleSaveStorage = (values, env) => {};

  return (
    <EkkoPanel>
      <h1>网关协议详情</h1>
      <h2>基本信息</h2>
      <EkkoForm ekkotag={`${namespace}.basic`} columns={getVersionFormConfig(id)} />
      <h2>版本列表</h2>
      <EkkoButton title="创建新版本" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={getVersionTableConfig(id)} />
      <h2>版本存储</h2>
      <Tabs>
        {Environment.map(env => (
          <TabPane key={env.value} tab={env.mean}>
            <EkkoEditTable
              columns={getStorageTableConfig()}
              ekkotag={`${namespace}.storage.${env.value}`}
              onSave={values => handleSaveStorage(values, env.value)}
            />
          </TabPane>
        ))}
      </Tabs>
    </EkkoPanel>
  );
}

export default connect()(Version);
