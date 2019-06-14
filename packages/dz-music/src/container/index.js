import React, { Component } from 'react'
import Header from './header'
import Leftnav from './leftnav'
import Footer from './footer'
import CSSModules from 'react-css-modules'
import styles from './index.less'

@CSSModules(styles)
export default class Container extends Component{
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className="dz-music">
        <Header />
        <div className="dz-music-container">
          <Leftnav />
          <div className="dz-main-container">
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
