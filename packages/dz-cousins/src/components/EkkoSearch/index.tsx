import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { Button } from 'antd';
import EkkoItem from '@/components/EkkoItem';
const styles = require('./index.less');

export interface EkkoSearchProps {
  columns: any[];
  onSearch?: (val: any) => any;
  data: any;
  ekkotag: string;
  dispatch: any;
}

const { useEffect } = React;

function EkkoSearch(props: EkkoSearchProps) {
  const { columns, data, ekkotag, dispatch } = props;

  // 获取初始值
  const getInitalValue = () => {
    const dfields = {};
    for (const item of props.columns) {
      dfields[item.datakey] = 'initialValue' in item ? item.initialValue : undefined;
    }
    return dfields;
  };

  // 重置为初始值
  const resetFields = () => {
    const searchInitial = getInitalValue();
    dispatch({
      type: 'global/setData',
      payload: {
        ekkotag: ekkotag,
        value: searchInitial,
      },
    });
  };

  // 设置初始值
  useEffect(resetFields, []);

  // 搜索
  const searchFields = () => {
    const values = get(data, ekkotag);
    if (props.onSearch) {
      props.onSearch(values);
    }
  };

  // 生成搜索区域
  const generateSearchItem = () => {
    return columns.map((item: any) => (
      <div className={styles['search-item']} key={item.datakey}>
        <div className={styles['title']}>{`${item.label}: `}</div>
        <div className={styles['comp']}>
          <EkkoItem ekkotag={`${ekkotag}.${item.datakey}`} key={item.datakey} {...item} inStore />
        </div>
      </div>
    ));
  };

  // 生成按钮区
  const generateButtons = () => {
    return [
      <Button onClick={resetFields} key="reset">
        重置
      </Button>,
      <Button type="primary" onClick={searchFields} key="search">
        搜索
      </Button>,
    ];
  };

  return (
    <div className={styles['ekko-search']}>
      {generateSearchItem()}
      <div className={styles['search-button-group']}>{generateButtons()}</div>
    </div>
  );
}

export default connect(({ global }) => ({ data: global }))(EkkoSearch);
