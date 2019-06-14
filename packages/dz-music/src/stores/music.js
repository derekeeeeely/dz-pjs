import { observable, action } from 'mobx'
import axios from 'axios'
import config from '../../config'
import parseLrc from '../utils/parseLrc'

class MyMusic{

  @observable musicInfoList = []
  @observable musicList = []
  @observable musicIds = []
  @observable nextList = []
  @observable nextIds = []
  @observable insertMark = false
  @observable currentSong = {}
  @observable currentTime = 0
  @observable lyrics = []

  @action getMusic(keywords) {
    axios.get(`${config.musicApi}/search`, {
      params: {
        keywords: keywords,
        limit: 50
      }
    })
    .then((res) => {
      if (res.data && res.data.result.songs) {
        this.musicInfoList = res.data.result.songs
        const ids = res.data.result.songs.map(e => e.id)
        this.nextIds = ids
        this.nextList = ids.map(e => `${config.netEaseApi}/outer/url?id=${e}.mp3`)
      }
    })
  }

  @action insertList() {
    this.insertMark = !this.insertMark
    this.musicIds = this.musicIds.concat(this.nextIds)
    this.musicList = this.musicList.concat(this.nextList)
  }

  @action insertSong(id) {
    this.insertMark = !this.insertMark
    const url = `${config.netEaseApi}/outer/url?id=${id}.mp3`
    this.musicList = this.musicList.concat([url])
    this.musicIds = this.musicIds.concat([id])
  }

  @action changeCurrentId(index) {
    const id = this.musicIds[index]
    axios.get(`${config.musicApi}/song/detail`, {
      params: {
        ids: id
      }
    })
    .then(res => {
      if (res.data && res.data.songs) {
        const info = res.data.songs[0]
        this.currentSong = {
          name: info.name,
          id: id,
          ar: info.ar && info.ar[0].name
        }
      }
    })
    axios.get(`${config.musicApi}/lyric`, {
      params: {
        id: id
      }
    })
    .then(res => {
      if (res.data && res.data.lrc) {
        let lyrics = res.data.lrc.lyric
        if(lyrics) {
          lyrics.replace(/\[/g, '\\n\[')
          this.lyrics = parseLrc(lyrics)
        } else {
          this.lyrics = []
        }
      }
    })

  }

  @action passTime(time) {
    this.currentTime = time
  }

}

const musicStore = new MyMusic()

export default musicStore
