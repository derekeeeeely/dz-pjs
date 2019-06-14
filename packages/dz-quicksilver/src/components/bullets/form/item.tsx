import * as React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

function AltFormItems(props: any) {
  const {
    form: { getFieldDecorator },
    fields = [{
      key: 'name',
      title: '姓名',
      type: 'input'
    }, {
      key: 'age',
      title: '年龄',
      type: 'input'
    }],
    layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    },
    disabled
  } = props;
  return (
    <div>
      {fields.map((field: any, inx: number) => (
        <FormItem label={field.title} {...layout} key={inx}>
          {getFieldDecorator(field.key, {
          })(
            <Input disabled={disabled} />
          )}
        </FormItem>
      ))}
    </div>
  );
}

export default Form.create()(AltFormItems)