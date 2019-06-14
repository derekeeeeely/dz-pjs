import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Form, Input, Table, Icon} from 'antd'
import CSSModules from 'react-css-modules'
import Lyric from '../../components/lrcflow'
import styles from './index.less'

const FormItem = Form.Item
@CSSModules(styles)
@Form.create()
@inject('musicStore')
@observer
export default class MusicBase extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

  }

  getMusic = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.keywords = values.keywords || '中国好声音'
      this.props.musicStore.getMusic(values.keywords)
    })
  }

  insertList = () => {
    this.props.musicStore.insertList()
  }

  insertSong = (text, record) => () => {
    console.log(record.id)
    this.props.musicStore.insertSong(record.id)
  }

  columns = [{
    title: 'title',
    dataIndex: 'name',
    width: '30%',
    key: 'name'
  }, {
    title: 'album',
    dataIndex: 'album',
    width: '30%',
    key: 'album'
  }, {
    title: 'artist',
    dataIndex: 'artist',
    width: '20%',
    key: 'artist'
  }, {
    title: 'options',
    dataIndex: 'operation',
    width: '20%',
    key: 'operation',
    render: (text, record) => {
      return (
        <div onClick={this.insertSong(text, record)}>
          <Icon
            type={'play-circle-o'}
          />
          <a className="ply-now-btn">play</a>
        </div>
      )
    }
  }]

  dataSource = () => {
    const { musicInfoList } = this.props.musicStore
    const lists = []
    musicInfoList.map(e => {
      lists.push({
        name: e.name,
        album: e.album && e.album.name,
        artist: e.artists && e.artists[0] && e.artists[0].name,
        id: e.id
      })
    })
    // debugger
    return lists
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { currentSong, lyrics, currentTime } = this.props.musicStore
    return (
      <div>
        <div className="music-index search">
          <FormItem className="music-search-form">
            {getFieldDecorator('keywords', {
            })(
              <Input onPressEnter={this.getMusic}/>
            )}
          </FormItem>
          <Button onClick={this.getMusic}>
            search
          </Button>
        </div>
        <div className="music-index body">
          <div className="play-all-btn">
            <Button onClick={this.insertList}>
              play all
            </Button>
          </div>
          <Table
            pagination={{
              pageSize: 8
            }}
            columns={this.columns}
            dataSource={this.dataSource()}
            size="small"
            style={{ width: '100%', fontSize: 14 }}
          />
        </div>
        {currentSong && currentSong.name ? (
          <div className="music-index lyric">
              <div className="play-title">
                <p className="music-name">{currentSong && currentSong.name}</p>
                <p className="music-ar">{currentSong && currentSong.ar}</p>
              </div>
            <Lyric
              lyrics={lyrics}
              currentTime={currentTime}
            />
          </div>
        ) : ''}
      </div>
    )
  }

}
