import React, { Component } from 'react'
import { Layout, Menu, Icon, Spin } from 'antd'
import _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import Panel from 'components/panel'
import { menu as menus, logo } from './config'
import './index.scss'
import TabList from './tablist';

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

@inject('publicStore')
@observer
class Container extends Component {
  changeTab = (menu) => {
    const url = menu.key
    const name = _.isArray(menu.item.props.children) ? menu.item.props.children[1] : menu.item.props.children
    const newCurrent = { url, name }
    this.props.publicStore.pushTab(newCurrent)
    this.props.history.push(url)
  }

  render() {
    const { loading, activeTab } = this.props.publicStore
    return (
      <Layout className="ekko" style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="logo">
            <Icon type="rocket" style={{ marginRight: 5 }}/>{logo}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={[activeTab]}
            selectedKeys={[activeTab]}
            mode="inline"
            onClick={this.changeTab}
          >
            {menus.map(menu => {
              if (menu.children) {
                return (
                  <SubMenu
                    key={menu.key}
                    title={<span>
                      <Icon type={menu.icon} /><span>{menu.name}</span>
                    </span>}
                  >
                    {menu.children.map( submenu => (
                      <Menu.Item key={submenu.url}>{submenu.name}</Menu.Item>
                    ))}
                  </SubMenu>
                )
              } else {
                return <Menu.Item key={menu.url}>
                <Icon type={menu.icon} />{menu.name}</Menu.Item>
              }
            })}
          </Menu>
        </Sider>
        <Layout>
          <Header className="header">
            <span className="login">
              <Icon
                type="user"
              />
              Ekko
            </span>
          </Header>
          <Content className="content">
            <TabList history={this.props.history} />
            <Spin spinning={loading}>
              <Panel>
                {this.props.children}
              </Panel>
            </Spin>
          </Content>
          <Footer className="footer">
            Ekko ©2018 Created by Dwd Front-platform
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(Container)
