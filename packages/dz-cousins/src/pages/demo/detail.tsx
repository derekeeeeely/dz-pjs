import * as React from 'react';
import { connect } from 'dva';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoForm from '@/components/EkkoForm';
import EkkoEditTable from '@/components/EkkoEditTable';
import { getFormConfig, editTableConfig } from './config';

const namespace = 'demo.detail';
const { useEffect } = React;
function Detail(props: any) {
  // id = 'add' 新增
  // mode = 'edit' 编辑
  // mode = 'view' 查看
  const { id } = props.computedMatch.params;
  const { mode = 'edit' } = props.location.query || {};
  const disabled = mode === 'view';

  // 翻译返回数据
  const translateResponseData = data => {
    return data;
  };

  // 翻译请求数据
  const translateRequestData = data => {
    return data;
  };

  // 获取数据
  const getPageData = () => {
    if (id !== 'add') {
      props.dispatch({
        type: 'global/getData',
        api: '/api/demo/detail',
        payload: { id },
        ekkotag: `${namespace}`,
        translation: translateResponseData,
      });
    }
  };

  // 进入页面获取数据
  useEffect(getPageData, []);

  // 保存基础信息-表单
  const handleSaveBasic = values => {
    props.dispatch({
      type: 'global/postData',
      api: '/api/demo/saveBasic',
      payload: {
        id,
        basic: translateRequestData(values),
      },
    });
  };

  // 保存具体信息-可编辑表格
  const handleSaveExtra = values => {
    props.dispatch({
      type: 'global/postData',
      api: '/api/demo/saveExtra',
      payload: {
        id,
        extra: translateRequestData(values),
      },
    });
  };

  return (
    <EkkoPanel>
      <h1>demo详情页</h1>
      <h2>基本信息</h2>
      <EkkoForm
        disabled={disabled}
        ekkotag={`${namespace}.basic`}
        columns={getFormConfig(id)}
        onSave={handleSaveBasic}
      />
      <h2>具体信息</h2>
      <EkkoEditTable
        disabled={disabled}
        ekkotag={`${namespace}.extra`}
        columns={editTableConfig}
        onSave={handleSaveExtra}
      />
    </EkkoPanel>
  );
}

export default connect()(Detail);
