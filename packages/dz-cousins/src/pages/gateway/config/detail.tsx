import * as React from 'react';
import { get } from 'lodash';
import EkkoButton from '@/components/EkkoButton';
import { ParameterType } from '@/utils/enums';

// 网关协议版本新增编辑--协议信息--请求、响应类型枚举
const rrTypes = [
  { value: 'application/json', mean: 'application/json' },
  { value: 'application/xml', mean: 'application/xml' },
  { value: 'text/plain', mean: 'text/plain' },
];

// 网关协议版本新增编辑--协议信息--表单
const getDetailFormConfig = id => [
  { label: '协议名称', datakey: 'name', type: 'input', disabled: id !== 'add' },
  { label: '业务标识', datakey: 'tag', type: 'input', disabled: id !== 'add' },
  { label: '业务版本', datakey: 'des', type: 'input', disabled: id !== 'add' },
  { label: '请求类型', datakey: 'reqType', type: 'select', options: rrTypes },
  { label: '响应类型', datakey: 'resType', type: 'select', options: rrTypes },
];

// 网关协议版本新增编辑--请求响应配置--公共请求参数--表单
const getRequestTableConfig = () => [
  { title: '参数名', datakey: 'name', key: 'name', type: 'input', width: 200 },
  {
    title: '参数类型',
    datakey: 'paramtype',
    key: 'paramtype',
    type: 'select',
    options: ParameterType,
    style: { minWidth: 100 },
  },
  { title: '是否必须', datakey: 'isrequired', key: 'isrequired', type: 'checkbox' },
  { title: '示例', datakey: 'demo', key: 'demo', type: 'input' },
  { title: '说明', datakey: 'desc', key: 'desc', type: 'input' },
  // { title: '约束', datakey: 'restraint', key: 'restraint', type: 'input' },
  {
    title: '操作',
    datakey: 'operation',
    key: 'operation',
    render: itemProps => {
      const { data, ekkotag, dispatch } = itemProps;
      const relatedTag = ekkotag.replace('operation', 'paramtype');
      const childrenTag = relatedTag.replace('paramtype', 'children');

      const value = get(data, relatedTag);

      if (value === 'STRUCT' || value === 'STRUCT_ARRAY') {
        return (
          <EkkoButton
            title="添加子属性"
            onClick={r => {
              const childrenValue = get(data, childrenTag) || [];
              childrenValue.push({});
              dispatch({
                type: 'global/setData',
                payload: {
                  ekkotag: childrenTag,
                  value: childrenValue,
                },
              });
            }}
          />
        );
      }
      return '';
    },
  },
];

// 网关协议版本新增编辑--请求响应配置--响应参数--表单
const getResponseTableConfig = () => [
  { title: '参数名', datakey: 'name', key: 'name', type: 'input', width: 200 },
  {
    title: '参数类型',
    datakey: 'paramtype',
    key: 'paramtype',
    type: 'select',
    options: ParameterType,
    style: { minWidth: 100 },
  },
  { title: '是否必须', datakey: 'isrequired', key: 'isrequired', type: 'checkbox' },
  { title: '示例', datakey: 'demo', key: 'demo', type: 'input' },
  { title: '说明', datakey: 'desc', key: 'desc', type: 'input' },
  {
    title: '操作',
    datakey: 'operation',
    key: 'operation',
    render: itemProps => {
      const { data, ekkotag, dispatch } = itemProps;
      const relatedTag = ekkotag.replace('operation', 'paramtype');
      const childrenTag = relatedTag.replace('paramtype', 'children');

      const value = get(data, relatedTag);

      if (value === 'STRUCT' || value === 'STRUCT_ARRAY') {
        return (
          <EkkoButton
            title="添加子属性"
            onClick={r => {
              const childrenValue = get(data, childrenTag) || [];
              childrenValue.push({});
              dispatch({
                type: 'global/setData',
                payload: {
                  ekkotag: childrenTag,
                  value: childrenValue,
                },
              });
            }}
          />
        );
      }
      return '';
    },
  },
];

// 网关协议版本新增编辑--请求响应配置--异常参数--表单
const getErrorTableConfig = () => [
  { title: '异常码', datakey: 'code', key: 'code', type: 'input' },
  { title: '描述', datakey: 'desc', key: 'desc', type: 'input' },
  { title: '异常说明', datakey: 'explain', key: 'explain', type: 'input' },
];

export { getDetailFormConfig, getRequestTableConfig, getResponseTableConfig, getErrorTableConfig };
