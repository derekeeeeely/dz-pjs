import React, { Component } from 'react'
import { Button, Icon, Progress, Slider, Form, Tooltip, message } from 'antd'
import CSSModules from 'react-css-modules'
import styles from './index.less'

const FormItem = Form.Item
@CSSModules(styles)
@Form.create()
export default class DZaudio extends Component{
  constructor(props) {
    super(props)
    this.state = {
      paused: true,
      pattern: this.props.loop !== undefined ? this.props.loop : false,
      progress: 0,
      total: '00:00',
      current: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    // 插入新的歌曲，为什么要这么个标志？
    if (this.props.insertMark !== nextProps.insertMark) {
      this.setState({
        progress: 0,
        paused: true,
        current: this.props.musicList.length,
      }, () => {
        this.playButton()
      })
    }
  }

  componentDidMount() {

    // 获取长度
    this.audio.addEventListener('loadedmetadata', () => {
      const min = Math.floor(this.audio.duration / 60)
      const sec = Math.floor(this.audio.duration - min * 60)
      const time = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
      this.setState({
        total: time
      })
    })

    // 实时进度条
    this.audio.addEventListener('timeupdate', () => {
      let progress = 0
      // 下一首的时候会先进到这里？！没获取到长度的时候会报错
      if (!!this.audio.duration) {
        progress = (this.audio.currentTime / this.audio.duration) * 100
      }
      this.props.passTime(this.audio.currentTime)
      this.props.form.setFieldsValue({
        slider: progress
      })
      this.setState({
        progress
      })
    })

    // 音乐结束
    this.audio.addEventListener('ended', () => {
      if (!this.audio.loop) {
        this.playNext()
      }
    })
  }

  playButton = () => {
    const { paused } = this.state
    const { musicList } = this.props
    if (musicList && musicList.length) {
      if (paused) {
        this.audio.play().then(() => {
          this.setState({
            paused: !this.state.paused
          })
          this.props.changeMusic(this.state.current)
        }, () => {
          message.error('seems we meet copyright issues, we will play next song for u~')
          this.playNext()
        })
      } else {
        this.audio.pause()
        this.setState({
          paused: !this.state.paused
        })
      }
    }
  }

  playPrev = () => {
    const listLength = this.props.musicList.length
    this.setState({
      current: --this.state.current < 0 ? (listLength-1) : this.state.current,
      paused: false
    }, () => {
      this.audio.play().then(() => {
        this.props.changeMusic(this.state.current)
      }, () => {
        message.error('seems we meet copyright issues, we will play next song for u~')
        this.playNext()
      })
    })
  }

  playNext = () => {
    const listLength = this.props.musicList.length
    this.setState({
      current: ++this.state.current >= listLength ? ((this.state.current)%listLength) : this.state.current,
      paused: false
    }, () => {
      this.audio.play().then(() => {
        this.props.changeMusic(this.state.current)
      }, () => {
        message.error('seems we meet copyright issues, we will play next song for u~')
        this.playNext()
      })
    })
  }

  // 拖拽时间
  changeTime = (e) => {
    this.audio.currentTime = (this.audio.duration * e) / 100
    this.audio.play().then(() => {
      this.setState({
        progress: e,
        paused: false
      })
    })
  }

  // 显示当前时间
  progressFormatter = (e) => {
    let time = '00:00'
    const { progress } = this.state
    if (this.audio && progress) {
      const min = Math.floor((this.audio.currentTime / 60))
      const sec = Math.floor(this.audio.currentTime - min * 60)
      time = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
    }
    return time
  }

  // 控制音量
  changeVolume = (e) => {
    this.audio.volume = +e/100
  }

  // 循环/顺序
  changePattern = () => {
    this.audio.loop = !this.audio.loop
    this.setState({
      pattern: this.audio.loop
    })
  }

  getVolume = () => {
    return (
      <div style={{ height: 100 }}>
        <Slider
          defaultValue={100}
          vertical
          onChange={this.changeVolume}
        />
      </div>
    )
  }

  render() {
    const { paused, progress, total, pattern, current } = this.state
    const { musicList } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className="dz-audio">
        <div className="controls">
          <Icon
            type="left-circle-o"
            className="prev"
            onClick={this.playPrev}
          />
          <Icon
            type={paused ? 'play-circle' : 'pause-circle'}
            className="play"
            onClick={this.playButton}
          />
          <Icon
            type="right-circle-o"
            className="next"
            onClick={this.playNext}
          />
          <Icon
            type={pattern ? 'sync' : 'swap'}
            className="pattern"
            onClick={this.changePattern}
          />
        </div>
        <div className="sliders">
          <FormItem>
            {getFieldDecorator('slider', {
              defaultValue: progress
            })(
              <Slider
                step={0.01}
                onAfterChange={this.changeTime}
                tipFormatter={this.progressFormatter}
              />
            )}
          </FormItem>
        </div>
        <div className="time">{total}</div>
        <div className="sound">
          <Tooltip placement="top" title={this.getVolume()}>
            <Icon type="sound"/>
          </Tooltip>
        </div>
        <audio
          src={musicList[current]}
          ref={r => this.audio = r}
          loop={this.props.loop !==undefined ? this.props.loop : false }
        />
      </div>
    )
  }
}
