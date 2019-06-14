import * as React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import EkkoPanel from '@/components/EkkoPanel';
import EkkoTable from '@/components/EkkoTable';
import EkkoSearch from '@/components/EkkoSearch';
import EkkoButton from '@/components/EkkoButton';
import { searchConfig, tableConfig } from './config';

const namespace = 'transit.list';

function List({ dispatch }) {
  // 搜索
  const handleSearch = (field: any) => {
    dispatch({
      type: 'global/getData',
      api: '/api/transit/list',
      payload: field,
      ekkotag: `${namespace}.table`,
    });
  };

  // 创建新协议-跳转到新增
  const handleAdd = () => {
    router.push('/transit/version/add');
  };

  return (
    <EkkoPanel>
      <h1>转发协议列表</h1>
      <EkkoSearch ekkotag={`${namespace}.search`} columns={searchConfig} onSearch={handleSearch} />
      <EkkoButton title="创建新协议" onClick={handleAdd} />
      <EkkoTable ekkotag={`${namespace}.table`} columns={tableConfig} />
    </EkkoPanel>
  );
}

export default connect()(List);
