import React, { Component } from 'react'
import Form from 'components/formPage'
import config from './config'

export default class FormTest extends Component {
  render() {
    return (
      <Form config={config}/>
    )
  }
}
