import { Layout, Menu } from 'antd';
import * as React from 'react';
import menu from 'constants/menu';
import './index.less'

const { Header, Content, Footer } = Layout;
const generateMenu = () => menu.map((item, inx) => <Menu.Item
  key={inx}
>
  <a href={`/#${item.url}`}>{item.title}</a>
</Menu.Item>)

export default function AltLayout(props: any) {
  return (
    <Layout className="dwd-alita">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']}
          style={{ lineHeight: '64px', fontSize: 17 }}
        >
          {generateMenu()}
        </Menu>
      </Header>
      <Content>
        <div style={{ padding: 24 }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Alita ©2019 Created by Dwd-Front
      </Footer>
    </Layout>
  );
}
