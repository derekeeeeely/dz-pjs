import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Search from 'components/searchPage'
import config from './config'

// 数据(前端状态)配置，模板文件生成时生成
const STORENAME = 'searchPageStore'

@inject(STORENAME)
@observer
export default class SearchTest extends Component {
  render() {
    return (
      <Search {...config} store={this.props[STORENAME]} />
    )
  }
}
