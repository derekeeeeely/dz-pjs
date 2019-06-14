import React, { Component } from 'react'
import Drawer from 'components/drawerPage'
import config from './config'

export default class DrawerTest extends Component {
  render() {
    return (
      <Drawer config={config} />
    )
  }
}
