import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { Table } from 'antd';

export interface EkkoTableProps {
  ekkotag: string;
  data: any[];
  columns: any[];
}

function EkkoTable(props: EkkoTableProps) {
  const { data, ekkotag, columns } = props;
  const values = get(data, ekkotag) || [];

  const newColumns = columns.map(item => ({ ...item, dataIndex: item.datakey }));

  return <Table bordered={true} dataSource={values} {...props} columns={newColumns} />;
}

export default connect(({ global }) => ({ data: global }))(EkkoTable);
