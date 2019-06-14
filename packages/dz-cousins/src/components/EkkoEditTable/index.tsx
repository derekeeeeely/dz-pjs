import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import EkkoItem from '@/components/EkkoItem';
import EkkoButton from '@/components/EkkoButton';

const styles = require('./index.less');

const makeCG = columns => {
  return (
    <colgroup>
      {columns.map((item: any, inx: number) => (
        <col width={item.width || ''} key={inx} />
      ))}
    </colgroup>
  );
};

function EkkoEditTable(props: any) {
  const { data, ekkotag, columns, okText, disabled, dispatch } = props;
  const values = get(data, ekkotag) || [];

  // 生成表头
  const makeHeader = columns => {
    return (
      <tr>
        {columns.map((item: any, inx: number) => (
          <th style={{ textAlign: 'center' }} key={inx}>
            <span>{item.title}</span>
          </th>
        ))}
        {!disabled && <th style={{ textAlign: 'center' }} key="delete" />}
      </tr>
    );
  };

  // render单行
  const renderRow = tag => {
    // children层级，用于样式变化
    const level = tag.split('children').length;
    return (
      <tr key={`row-${tag}`}>
        {columns.map((column, innerinx) => {
          const columnProps = {
            ekkotag: `${tag}.${column.datakey}`,
            key: column.datakey,
            disabled,
            ...column,
          };
          let tdStyle = {};
          if (!innerinx) {
            tdStyle = { paddingLeft: 25 * (level - 1) || 10 };
          }
          return (
            <td key={`column-${innerinx}`} style={tdStyle}>
              <EkkoItem {...columnProps} inStore />
            </td>
          );
        })}
        {!disabled && (
          <td key={`column-delete`}>
            <EkkoButton onClick={r => handleDelete(tag)} title="删除" disabled={disabled} />
          </td>
        )}
      </tr>
    );
  };

  // 递归生成可编辑表格行
  const RenderRows = [];
  const makeRows = (rows, tag) => {
    rows.map((item, inx) => {
      const rowTag = `${tag}.${inx}`;
      RenderRows.push(renderRow(rowTag));
      if (item.children) {
        makeRows(item.children, `${rowTag}.children`);
      }
    });
  };
  const makeColumns = () => {
    makeRows(values, ekkotag);
    return RenderRows;
  };

  // 保存
  const handleSave = () => {
    if (props.onSave) {
      props.onSave(values);
    }
  };

  // 新增
  const handleAdd = () => {
    values.push({});
    const newValue = values.map(item => item);
    dispatch({
      type: 'global/setData',
      payload: {
        ekkotag,
        value: newValue,
      },
    });
  };

  // 删除
  const handleDelete = tag => {
    const [index, ...tags] = tag.split('.').reverse();
    const value = get(data, tags.reverse().join('.')) || [];
    const newValue = value.filter((item, inx) => inx !== +index);
    dispatch({
      type: 'global/setData',
      payload: {
        ekkotag: tags.join('.'),
        value: newValue,
      },
    });
  };

  // 新增、保存
  const generateButtons = () => {
    return [
      <EkkoButton key="add" title="添加" onClick={handleAdd} style={{ marginRight: 10 }} />,
      <EkkoButton key="save" title={okText || '保存'} onClick={handleSave} type="primary" />,
    ];
  };

  return (
    <div className={styles['ekko-editTable']}>
      <div className="ant-table">
        <div className="ant-table-body">
          <table>
            {makeCG(columns)}
            <thead className="ant-table-thead">{makeHeader(columns)}</thead>
            <tbody className="ant-table-tbody">{makeColumns()}</tbody>
          </table>
          {!values.length && <div className={styles['default-nothing']}>暂无数据</div>}
          {!disabled && generateButtons()}
        </div>
      </div>
    </div>
  );
}

export default connect(({ global }) => ({ data: global }))(EkkoEditTable);
