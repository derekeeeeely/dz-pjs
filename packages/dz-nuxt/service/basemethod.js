/*
* @Author: derekeeeeely
* @Date:   2017-04-22 17:29:44
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-22 17:29:52
*/

import axios from 'axios'
import qs from 'qs'

// function getUrl (path) {
//   if (path.startsWith('http:') || path.startsWith('https:')) {
//     return path
//   } else {
//     return root + path
//   }
// }

function proessData (response, e) {
  let result = response.data
  if (result) {
    return result
  }
  console.log('basemethod error: ', result, e)
  throw result || e
}

function serialize (data = {}) {
  let dataStr = []
  Object.keys(data).forEach(k => {
    let value = data[k]
    if (value !== null && value !== undefined) {
      dataStr.push(`${k}=${encodeURI(value)}`)
    }
  })
  return dataStr.join('&')
}

function get (path, data, config) {
  // let url = getUrl(path)
  return axios.get(path + '?' + serialize(data), config).then(proessData)
}

function post (path, data, config) {
  // let url = getUrl(path)
  let qsdata = qs.stringify(data)
  return axios.post(path, qsdata, config).then(proessData)
}

function page (path, currentPage = 1, pageSize = 10, data = {}) {
  data.currentPage = currentPage
  data.pageSize = pageSize
  return get(path, data)
}

export default { get, post, page }

