import React, { Component } from "react"
import CSSModules from "react-css-modules";
import styles from "./index.less";

export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="dz-liluo">
        <div className="header">Welcome to Liluo's Data System</div>
        {this.props.children}
      </div>
    )
  }
}
