import React, { Component } from 'react'
import _ from 'lodash'
import CSSModules from 'react-css-modules'
import styles from './index.less'
import parseLrc from '../../utils/parseLrc'

@CSSModules(styles)
export default class Lyric extends Component{

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    const currentLines = this.getCurrentLine(nextProps.lyrics, nextProps.currentTime)
    this.setState({
      lyrics: nextProps.lyrics,
      currentTime: nextProps.currentTime,
      currentLine: currentLines,
    })
  }

  getCurrentLine = (lyrics, time) => {
    const computedLyrics = lyrics.map(e => {
      return {
        time: _.isObject(e) && +Object.keys(e)[0],
        line: _.isObject(e) && `${Object.values(e)[0].trim()}\n`
      }
    })
    computedLyrics.push({
      time: 999999,
      line: '......'
    })
    for (let i = 0; i < computedLyrics.length; i++) {
      if (computedLyrics[i].time > time) {
        return [computedLyrics[i-2], computedLyrics[i-1], computedLyrics[i]]
      }
    }
  }

  render() {
    const { currentLine } = this.state
    return (
      <pre>
        <p>{currentLine && currentLine[0] ? currentLine[0].line : "..."}</p>
        <p className="middle">{currentLine && currentLine[1] && currentLine[1].line}</p>
        <p>{currentLine && currentLine[2] && currentLine[2].line}</p>
      </pre>
    )
  }

}
