import * as React from 'react';
import { Tabs } from 'antd';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoForm from '@/components/EkkoForm';
import EkkoEditTable from '@/components/EkkoEditTable';
import { connect } from 'dva';
import { Environment } from '@/utils/enums';
import { transitProtocolFormConfig, transitVariableTableConfig } from '../config/detail';

const namespace = 'interfaces.detail.env';
const { TabPane } = Tabs;

function VersionEnv(props: any) {
  // 区分新增、编辑、查看
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 环境变量配置保存
  const handleSaveEnv = (values, env) => {};

  return (
    <EkkoPanel>
      <h2>转发协议选择</h2>
      <EkkoForm ekkotag={`${namespace}.protocol`} columns={transitProtocolFormConfig} disabled />
      <h2>环境变量配置</h2>
      <Tabs>
        {Environment.map(env => (
          <TabPane key={env.value} tab={env.mean}>
            <EkkoEditTable
              columns={transitVariableTableConfig}
              ekkotag={`${namespace}.${env.value}`}
              onSave={values => handleSaveEnv(values, env.value)}
              disabled={disabled}
            />
          </TabPane>
        ))}
      </Tabs>
    </EkkoPanel>
  );
}

export default connect()(VersionEnv);
