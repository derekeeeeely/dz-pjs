import axios from 'axios'
import { message } from 'antd'
import PublicStore from '../store/public'

const fetchJSONByGet = (url, params) => {
  return new Promise((resolve, reject) => {
    PublicStore.changeLoading()
    axios.get(url, {
      params: { ...params }
    }).then(res => {
      PublicStore.changeLoading()
      resolve(res.data)
    }).catch(err => {
      message.error(err)
      PublicStore.changeLoading()
      reject(err)
    })
  })
}

const fetchJSONByPost = (url, params) => {
  return new Promise((resolve, reject) => {
    PublicStore.changeLoading()
    axios.post(url, params).then(res => {
      PublicStore.changeLoading()
      resolve(res.data.data)
    }).catch(err => {
      message.error(err)
      PublicStore.changeLoading()
      reject(err)
    })
  })
}


export {
  fetchJSONByGet,
  fetchJSONByPost
}