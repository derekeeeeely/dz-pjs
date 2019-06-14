/*
* @Author: derekeeeeely
* @Date:   2017-04-22 17:29:12
* @Last Modified by:   derekeeeeely
* @Last Modified time: 2017-04-22 17:49:47
*/

import baseMethod from './basemethod'
import apiConfig from '../conf/config'
const env    = process.env.NODE_ENV || "development";
const baseUrl = apiConfig[env].baseUrl

export default{
    //获取首页详情
    loadHomepage() {
        return baseMethod.get(baseUrl + '/api/articles', {})
    },
}
