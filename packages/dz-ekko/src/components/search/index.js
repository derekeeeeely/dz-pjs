import React, { Component } from 'react'
import moment from 'moment'
import { Select, Input, Button, DatePicker, message, InputNumber } from 'antd'
import './index.scss'

const Option = Select.Option

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.setDefaultField()
  }

  setDefaultField = () => {
    for (const field of (this.props.fields || [])) {
      if ('defaultValue' in field) {
        this.setField(field)(field.defaultValue);
      }
    }
  }

  setField = (field) => (e) => {
    let newValue = e
    if (field.type === 'input') {
      newValue = e.target.value
    }
    if (field.type === 'time') {
      newValue = e.format(field.format || 'YYYY-MM-DD')
    }
    this.setState({
      [field.dataKey]: newValue
    })
  }

  onReset = () => {
    for (const field of (this.props.fields || [])) {
      if ('defaultValue' in field) {
        this.setState({
          [field.dataKey]: field.defaultValue
        })
      } else {
        this.setState({
          [field.dataKey]: undefined
        })
      }
    }
  }

  onSearch = () => {
    const { onSearch, fields } = this.props
    for (const field of (fields || [])) {
      if (field.required && !this.state[field.dataKey]) {
        message.error(`${field.title} 必选`)
        return
      }
    }
    if (onSearch && typeof onSearch === 'function') {
      onSearch(this.state)
    }
  }

  generateFields = () => {
    const { fields = [] } = this.props
    const components = []
    fields.map((field) => {
      let component
      switch (field.type) {
        case 'input':
          component = (<Input
            value={this.state[field.dataKey]}
            placeholder={field.placeholder || '请输入'}
            onChange={this.setField(field)}
          />)
          break;
        case 'number':
          component = (<InputNumber
            value={this.state[field.dataKey]}
            placeholder={field.placeholder || '请输入'}
            onChange={this.setField(field)}
          />)
          break;
        case 'select':
          component = (<Select
            style={{ width: '100%', minWidth: 80 }}
            value={this.state[field.dataKey]}
            defaultValue={field.defaultValue || ''}
            placeholder={field.placeholder || '请选择'}
            onChange={this.setField(field)}
            allowClear
          >
            {(field.options || []).map(option => (
              <Option key={option.mean} value={option.code}>
                {option.mean}
              </Option>
            ))}
          </Select>)
          break;
        case 'time':
          component = (<DatePicker
            value={this.state[field.dataKey] ? moment(this.state[field.dataKey]) : undefined}
            format={fields.format || 'YYYY-MM-DD'}
            defaultValue={field.defaultValue ? moment(field.defaultValue) : undefined}
            showTime={field.showTime}
            placeholder={field.placeholder || '请选择'}
            onChange={this.setField(field)}
          />)
          break;

        default:
          break;
      }
      components.push(<div className="search-item" key={field.title}>
        <div className="title">{`${field.title}: `}</div>
        <div className="comp">{component}</div>
      </div>)
    })
    return components
  }

  generateButtons = () => {
    return (
      [<Button onClick={this.onReset} key="reset">重置</Button>,
      <Button type="primary" onClick={this.onSearch} key="search">搜索</Button>]
    )
  }

  render() {
    return (
      <div className="ekko-search">
        {this.generateFields()}
        <div className="search-button-group">
          {this.generateButtons()}
        </div>
      </div>
    )
  }
}
