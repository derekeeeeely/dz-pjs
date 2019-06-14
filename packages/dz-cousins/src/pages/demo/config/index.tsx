import * as React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

// 列表-搜索
const searchConfig = [{ label: '名称', datakey: 'name', type: 'input' }];

// 列表-表格
const tableConfig = [
  { title: '名称', datakey: 'name', key: 'name' },
  { title: '说明', datakey: 'desc', key: 'desc' },
  {
    title: '操作',
    datakey: 'action',
    key: 'action',
    width: 200,
    render: (text, record) => {
      return [
        <Button
          style={{ margin: '0 5px' }}
          onClick={() => {
            const target = {
              pathname: `/demo/${record.id || 1}`,
              query: { mode: 'view' },
            };
            // 跳转到详情-查看
            router.push(target);
          }}
        >
          查看
        </Button>,
        <Button
          style={{ margin: '0 5px' }}
          onClick={() => {
            const target = {
              pathname: `/demo/${record.id || 1}`,
              query: { mode: 'edit' },
            };
            // 跳转到详情-编辑
            router.push(target);
          }}
        >
          编辑
        </Button>,
      ];
    },
  },
];

// 详情--基础信息--表单
const getFormConfig = stage => [
  { label: '名称', datakey: 'name', type: 'input', disabled: stage !== 'add' },
  { label: '说明', datakey: 'desc', type: 'input' },
];

// 详情-具体信息--可编辑表格
const editTableConfig = [
  { title: '属性1', datakey: 'key1', key: 'key1', type: 'input' },
  { title: '属性2', datakey: 'key2', key: 'key2', type: 'input' },
  { title: '属性3', datakey: 'key3', key: 'key3', type: 'input' },
];

export { searchConfig, tableConfig, getFormConfig, editTableConfig };
