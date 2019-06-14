import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import EkkoItem from '@/components/EkkoItem';
const styles = require('./index.less');

const FormItem = Form.Item;
const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

function EkkoForm(props: any) {
  const { ekkotag, data, columns, form, onSave, disabled } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const values = get(data, ekkotag) || {};

  const generateFormItem = () => {
    return columns.map((item: any) => (
      <FormItem label={item.label} {...item.laout || layout} key={item.datakey}>
        {getFieldDecorator(item.datakey, {
          initialValue: values[item.datakey],
          rules: item.rules || undefined,
        })(
          <EkkoItem
            disabled={disabled}
            ekkotag={`${ekkotag}.${item.datakey}`}
            key={item.datakey}
            {...item}
            inStore={false}
            mode="form"
          />
        )}
      </FormItem>
    ));
  };

  const saveForm = () => {
    validateFieldsAndScroll((err, val) => {
      if (err) {
        return;
      }
      // dispatch({
      //   type: 'global/setData',
      //   payload: {
      //     ekkotag,
      //     value: val,
      //   },
      // });
      if (onSave) {
        onSave(val);
      }
    });
  };

  // 生成按钮区
  const generateButtons = () => {
    return (
      <Button type="primary" onClick={saveForm}>
        {props.okText || '保存'}
      </Button>
    );
  };

  return (
    <div className={styles['ekko-form']}>
      {generateFormItem()}
      {!disabled && <div className={styles['form-button-group']}>{generateButtons()}</div>}
    </div>
  );
}

export default connect(({ global }) => ({ data: global }))(Form.create()(EkkoForm));
