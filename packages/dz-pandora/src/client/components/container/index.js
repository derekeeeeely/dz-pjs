import React, { Component } from "react"
import TopNav from './topnav'
import styles from "./index.less"

export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="dz-pandora">
        <div className="header">Dz's Gensokyo Pandora</div>
        <TopNav />
        {this.props.children}
      </div>
    )
  }
}
