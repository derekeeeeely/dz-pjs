import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Tabs } from 'antd'
import './index.scss'

const TabPane = Tabs.TabPane
@inject('publicStore')
@observer
export default class TabList extends Component {
  onChange = (url) => {
    this.props.publicStore.changeTab(url)
    this.props.history.push(url)
  }

  onEdit = (url, action) => {
    if (action === 'remove') {
      this.props.publicStore.popTab(url)
      this.props.history.push(this.props.publicStore.activeTab)
    }
  }

  render() {
    const { tabList, activeTab } = this.props.publicStore
    return (
      <div className="ekko-tab">
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={activeTab}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {tabList.map(tab => (
            <TabPane tab={tab.name} key={tab.url} className={activeTab === tab.url ? 'active' : ''} />
          ))}
        </Tabs>
      </div>
    )
  }
}
