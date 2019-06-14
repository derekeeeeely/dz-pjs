import React, { Component } from 'react'
import QForm from '../form'
import { fetchJSONByPost } from 'utils/ajax'

export default class FormPage extends Component {
  handleOk = (values) => {
    const { config } = this.props
    fetchJSONByPost(config.url, values)
      .then((res) => { console.log(res) })
  }
  render() {
    const { config } = this.props
    return (
      <div>
        <QForm config={config.items} okText="保存" onOk={this.handleOk} />
      </div>
    );
  }
}