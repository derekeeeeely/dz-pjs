import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import {withRouter} from "react-router-dom"

const SubMenu = Menu.SubMenu

class Leftnav extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (e) => {
    console.log(e)
    const { history } = this.props
    const linkUrl = e.keyPath.reverse().join('/')
    history.push(`/${linkUrl}`)
  }

  render(){
    return (
      <div className="dz-music-leftnav">
        <Menu
          theme="dark"
          onClick={this.handleClick}
          className="menubar"
          mode="inline"
        >
          <SubMenu
            key="music"
            title={<span><Icon type="play-circle-o" /><span>music</span></span>}
          >
            <Menu.Item key="favorite">Favorite</Menu.Item>
          </SubMenu>
          <SubMenu
            key="movies"
            title={<span><Icon type="video-camera" /><span>movies</span></span>}
          >
            <Menu.Item key="random">Random</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}

export default withRouter(Leftnav)
