import React, { Component } from 'react';
import { Form, Input, Select, Button, Row, Col, InputNumber } from 'antd'

const FormItem = Form.Item
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

@Form.create()
class QForm extends Component {
  onOk = () => {
    const { form, onOk } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk && onOk(values)
      }
    });
  }
  renderFormItmesByConfig = (config) => {
    const formItmes = []
    const { form } = this.props;
    const { getFieldDecorator } = form;
    config.map(configObj => {
      let targetItem;
      const CommonFormItemProps = {
        key: configObj.dataKey,
        label: configObj.title,
        ...formItemLayout
      }
      switch (configObj.type) {
        case 'input':
          targetItem = (
            <FormItem
              {...CommonFormItemProps}
            >
              {getFieldDecorator(configObj.dataKey, {
                rules: configObj.rules || []
              })(
                <Input placeholder={`请输入${configObj.title}`} />
              )}
            </FormItem>
          )
          break;
        case 'number':
          targetItem = (
            <FormItem
              {...CommonFormItemProps}
            >
              {getFieldDecorator(configObj.dataKey, {
                rules: configObj.rules || []
              })(
                <InputNumber placeholder={`请输入${configObj.title}`} style={{ width: '100%' }}/>
              )}
            </FormItem>
          )
          break;
        case 'select':
          targetItem = (
            <FormItem
              {...CommonFormItemProps}
            >
              {getFieldDecorator(configObj.dataKey, {
                rules: configObj.rules || []
              })(
                <Select placeholder={`请选择${configObj.title}`} style={{ width: '100%' }} >
                  {configObj.options.map(item => <Option key={item.value}>{item.mean}</Option>)}
                </Select>
              )}
            </FormItem>
          )
          break;
        default:
          break;
      }
      formItmes.push(targetItem)
    })
    return formItmes
  }
  render() {
    const { config, okText } = this.props
    return (
      <div>
        {this.renderFormItmesByConfig(config)}
        <Row>
          <Col span={24} push={6}>
            <Button onClick={this.onOk}>{okText || '提交'}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QForm;