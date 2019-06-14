import React, { Component } from "react"
import { Menu, Icon } from "antd";
import { withRouter } from "react-router-dom";

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
class TopNav extends Component {
  constructor(props) {
    super(props)
    this.state = { current: 'home' }
  }

  handleClick = (e) => {
    this.setState({ current: e.key })
    const { history } = this.props;
    const linkUrl = e.keyPath.reverse().join("/");
    history.push(`/${linkUrl}`);
  }

  render() {
    return <div className="topnav">
        <Menu mode="horizontal" onClick={this.handleClick} selectedKeys={[this.state.current]}>
          <MenuItem key="home">
            <Icon type="calendar" />Home
          </MenuItem>
          <MenuItem key="code">
            <Icon type="code-o" />Coding
          </MenuItem>
          <MenuItem key="life">
            <Icon type="lock" />Living
          </MenuItem>
          <MenuItem key="maybe">
            <Icon type="hourglass" />Maybe
          </MenuItem>
        </Menu>
      </div>;
  }
}

export default withRouter(TopNav)
