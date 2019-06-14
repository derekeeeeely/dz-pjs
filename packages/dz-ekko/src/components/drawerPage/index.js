import React, { Component } from 'react'
import { Button, Drawer } from 'antd'
import './index.scss'

export default class DrawerTest extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.props.config.map(btn => {
      this.state[btn.key] = false
    })
  }

  onOk = key => () => {
    this.setState({
      [key]: false
    })
  }

  onOpen = key => () => {
    this.setState({
      [key]: true
    })
  }

  render() {
    const { config} = this.props
    return (
      <div className="drawer-page">
        <div className="btn-group">
          {config.map(btn => (
            <Button key={btn.key} onClick={this.onOpen(btn.key)}>
              {btn.title}
            </Button>
          ))}
        </div>
        <div className="drawer-group">
          {config.map(btn => (
            <Drawer
              width="50%"
              maskClosable
              key={btn.key}
              title={btn.title}
              onClose={this.onOk(btn.key)}
              onCancel={this.onOk(btn.key)}
              visible={this.state[btn.key]}
            >
              213
            </Drawer>
          ))}
        </div>
      </div>
    )
  }
}
