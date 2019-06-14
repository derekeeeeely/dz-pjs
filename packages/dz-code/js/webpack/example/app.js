import React, { Component } from 'react'
import styles from './app.less'
import myImg from './images/test.jpg'
import derek from 'derek'

export default class App extends Component{
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(styles, __DEV__)
  }

  render() {
    return (
      <div className={styles.app}>
        {derek}
        react app
        <img className="global" src={myImg} />
      </div>
    )
  }
}
