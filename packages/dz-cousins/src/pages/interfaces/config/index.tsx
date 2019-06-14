import * as React from 'react';
import { Button } from 'antd';
import router from 'umi/router';

const interfaceType = [{ value: 1, mean: '大接口' }, { value: 2, mean: '小接口' }];

// 列表页--搜索
const searchConfig = [
  { label: '接口名称', datakey: 'name', type: 'input' },
  {
    label: '接口分类',
    datakey: 'type',
    type: 'select',
    options: interfaceType,
    style: { width: '100%', minWidth: 100 },
  },
];

// 列表页--列表
const listTableConfig = [
  { title: '接口标识', datakey: 'tag', key: 'tag' },
  { title: '接口名称', datakey: 'name', key: 'name' },
  { title: '接口描述', datakey: 'devversion', key: 'devversion' },
  {
    title: '操作',
    datakey: 'action',
    key: 'action',
    width: '10%',
    render: (text, record) => {
      return (
        <Button
          onClick={() => {
            router.push(`/interfaces/${record.id || 1}`);
          }}
        >
          查看详情
        </Button>
      );
    },
  },
];

// 版本列表--基础信息--表单
const getVersionFormConfig = stage => [
  { label: '接口标识', datakey: 'tag', type: 'input', disabled: stage !== 'add' },
  { label: '接口名称', datakey: 'name', type: 'input', disabled: stage !== 'add' },
  { label: '接口描述', datakey: 'des', type: 'textarea' },
  { label: '文档可见', datakey: 'visible', type: 'checkbox' },
  { label: '文档可见', datakey: 'authoried', type: 'checkbox' },
];

// 版本列表--列表
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
                pathname: `/interfaces/version/basic/${record.id}`,
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
                pathname: `/interfaces/version/basic/${record.id}`,
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

export { searchConfig, listTableConfig, getVersionFormConfig, getVersionTableConfig };
