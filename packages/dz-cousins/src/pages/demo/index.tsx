import * as React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoSearch from '@/components/EkkoSearch';
import EkkoButton from '@/components/EkkoButton';
import EkkoTable from '@/components/EkkoTable';
import { searchConfig, tableConfig } from './config';

const namespace = 'demo.list';
const { useEffect } = React;
function List({ dispatch }) {
  // 有时接口返回的数据不是自己要的，可以在这里翻译
  const translation = data => {
    return data;
  };

  // 搜索，获取数据
  const getPageData = (field?: any) => {
    dispatch({
      type: 'global/getData',
      // 接口地址
      api: '/api/demo/list',
      payload: field,
      // 接口数据用在对应哪个组件，tag标明
      ekkotag: `${namespace}.table`,
      // 翻译数据
      translation,
    });
  };

  // 进入时搜索，可去掉
  useEffect(getPageData, []);

  // 跳转到详情-新增
  const handleAdd = () => {
    router.push('/demo/add');
  };

  return (
    <EkkoPanel>
      <h1>demo列表页</h1>
      <EkkoSearch ekkotag={`${namespace}.search`} columns={searchConfig} onSearch={getPageData} />
      <EkkoButton title="创建新项" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={tableConfig} />
    </EkkoPanel>
  );
}

export default connect()(List);
