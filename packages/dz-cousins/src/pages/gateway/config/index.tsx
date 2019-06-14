import * as React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

// 协议列表--搜索
const searchConfig = [{ label: '协议名称', datakey: 'name', type: 'input' }];

// 协议列表--表格
const tableConfig = [
  { title: '协议名称', datakey: 'name', key: 'name' },
  { title: '协议说明', datakey: 'desc', key: 'desc' },
  {
    title: '操作',
    datakey: 'action',
    key: 'action',
    width: '20%',
    render: (text, record) => {
      return (
        <Button
          onClick={() => {
            router.push(`/gateway/${record.id || 1}`);
          }}
        >
          查看详情
        </Button>
      );
    },
  },
];

// 协议详情--基础信息--表单
const getVersionFormConfig = stage => [
  { label: '协议名称', datakey: 'name', type: 'input', disabled: stage !== 'add' },
  { label: '协议标识', datakey: 'tag', type: 'input', disabled: stage !== 'add' },
  { label: '协议说明', datakey: 'explain', type: 'checkbox' },
  { label: '协议描述', datakey: 'des', type: 'textarea' },
];

// 协议详情-版本列表--列表
const getVersionTableConfig = stage => [
  { title: '业务版本', datakey: 'tag', key: 'tag' },
  { title: '开发版本', datakey: 'name', key: 'name' },
  { title: '父源版本', datakey: 'devversion', key: 'devversion' },
  { title: '接口描述', datakey: 'desc', key: 'desc' },
  {
    title: '操作',
    datakey: 'action',
    key: 'action',
    width: '20%',
    render: (text, record) => {
      return (
        <div>
          <Button
            onClick={() => {
              const target = {
                pathname: `/gateway/version/${record.id || 1}`,
                query: { mode: 'edit' },
              };
              router.push(target);
            }}
          >
            编辑
          </Button>
          <Button
            onClick={() => {
              const target = {
                pathname: `/gateway/version/${record.id || 1}`,
                query: { mode: 'view' },
              };
              router.push(target);
            }}
          >
            查看
          </Button>
        </div>
      );
    },
  },
];

// 版本详情-版本存储-表格
const getStorageTableConfig = () => [
  { title: '变量名', datakey: 'name', key: 'name', type: 'input' },
  { title: '示例', datakey: 'demo', key: 'demo', type: 'input' },
  { title: '变量值', datakey: 'value', key: 'value', type: 'input' },
];

export {
  searchConfig,
  tableConfig,
  getVersionFormConfig,
  getVersionTableConfig,
  getStorageTableConfig,
};
