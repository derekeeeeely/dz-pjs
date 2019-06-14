import * as React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoTable from '@/components/EkkoTable';
import EkkoSearch from '@/components/EkkoSearch';
import EkkoButton from '@/components/EkkoButton';
import { searchConfig, listTableConfig } from './config';

const namespace = 'interfaces.list';
function List({ dispatch }) {
  // 搜索
  const handleSearch = (field: any) => {
    dispatch({
      type: 'global/getData',
      api: '/api/interfaces/list',
      payload: field,
      ekkotag: `${namespace}.table`,
    });
  };

  // 创建新接口-跳转到新增
  const handleAdd = () => {
    router.push('/interfaces/version/basic/add');
  };

  return (
    <EkkoPanel>
      <h1>接口列表</h1>
      <EkkoSearch ekkotag={`${namespace}.search`} columns={searchConfig} onSearch={handleSearch} />
      <EkkoButton title="创建新接口" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={listTableConfig} />
    </EkkoPanel>
  );
}

export default connect()(List);
