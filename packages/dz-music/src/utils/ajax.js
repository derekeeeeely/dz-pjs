import fetch from 'isomorphic-fetch'
import { message } from 'antd'

export function fetchJSON(url, params) {
  params = {
    ...params,
    headers: {
      'Content-Type': 'application/json',
      ...params.headers,
    }
  }
  url = `http://localhost:3000/${url}`
  return fetch(url, params)
}
