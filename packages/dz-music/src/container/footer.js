import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import DZaudio from '../components/audio'

@inject('musicStore')
@observer
export default class Header extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  changeCurrentId = (index) => {
    this.props.musicStore.changeCurrentId(index)
  }

  passTime = (time) => {
    this.props.musicStore.passTime(time)
  }

  render(){
    const { musicList, insertMark } = this.props.musicStore
    return (
      <div className="dz-music-footer">
        <DZaudio
          passTime={this.passTime}
          musicList={musicList}
          insertMark={insertMark}
          changeMusic={this.changeCurrentId}
        />
      </div>
    )
  }
}
