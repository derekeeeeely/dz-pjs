import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

class Header extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  goHome = () => {
    this.props.history.push('/')
  }

  render(){
    return (
      <div className="dz-music-header">
        <div className="title" style={{ cursor: 'pointer' }} onClick={this.goHome}>DZ's Gensokyo II</div>
      </div>
    )
  }
}

export default withRouter(Header)
