import * as React from 'react';
import { get } from 'lodash';
import EkkoButton from '@/components/EkkoButton';
import { ParameterType } from '@/utils/enums';

// 版本新增编辑--基础信息--表单
const getDetailFormConfig = id => [
  { label: '接口标识', datakey: 'tag', type: 'input', disabled: id !== 'add' },
  { label: '接口名称', datakey: 'name', type: 'input', disabled: id !== 'add' },
  { label: '接口描述', datakey: 'des', type: 'textarea' },
  { label: '文档可见', datakey: 'visible', type: 'checkbox' },
  { label: '文档可见', datakey: 'authoried', type: 'checkbox' },
];

// 版本新增编辑--请求响应参数--请求参数--表单
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
  { title: '约束', datakey: 'restraint', key: 'restraint', type: 'input' },
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

// 版本新增编辑--请求响应参数--响应参数--表单
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

// 版本新增编辑--请求响应参数--异常参数--表单
const getErrorTableConfig = () => [
  { title: '异常码', datakey: 'code', key: 'code', type: 'input' },
  { title: '描述', datakey: 'desc', key: 'desc', type: 'input' },
  { title: '异常说明', datakey: 'explain', key: 'explain', type: 'input' },
];

// 转发协议选择
const transitProtocolFormConfig = [
  { label: '协议选择', datakey: 'protocol', type: 'select' },
  { label: '协议版本', datakey: 'version', type: 'select' },
];

// 转发协议变量配置
const transitVariableTableConfig = [
  { title: '变量名', datakey: 'name', key: 'name', type: 'input' },
  { title: '示例', datakey: 'demo', key: 'demo', type: 'input' },
  { title: '变量值', datakey: 'value', key: 'value', type: 'input' },
];

export {
  // 基础信息
  getDetailFormConfig,
  // 请求响应
  getRequestTableConfig,
  getResponseTableConfig,
  getErrorTableConfig,
  // 转发协议
  transitProtocolFormConfig,
  transitVariableTableConfig,
};
