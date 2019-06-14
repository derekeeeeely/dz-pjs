import React, { Component } from 'react'
import './index.scss'

export default class Panel extends Component {

  render() {
    return (
      <div className="panel">
        <div className="panel-body">{this.props.children}</div>
      </div>
    );
  }
}
