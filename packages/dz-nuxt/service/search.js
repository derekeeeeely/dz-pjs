/*
* @Author: derek
* @Date:   2017-04-23 20:35:23
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-26 18:26:45
*/


// import baseMethod from './basemethod'
import axios from 'axios'
import apiConfig from '../conf/config'
const env    = process.env.NODE_ENV || "development";
const baseUrl = apiConfig[env].baseUrl

export default{
    //获取首页详情
    loadArticleById(param) {
        return axios.post(baseUrl + '/api/id', {param})
    },
}
