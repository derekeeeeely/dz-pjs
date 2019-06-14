/*
 * @Author: Derek
 * @Date:   2017-04-18 13:21:03
 * @Last Modified by:   derek
 * @Last Modified time: 2017-04-23 19:38:05
 */

import axios from 'axios'
import qs from 'qs'

export const state = {
    isLoggedIn: false,
}

export const mutations = {
    REQUEST_setLogin_SUCCESS(state, action) {
        state.isLoggedIn = true
    },
    REQUEST_setLogin_FAILURE(state, action) {
        state.homeData = false
    }
}

export const actions = {
    nuxtServerInit(store, { params, route, isServer, req }) {
        // 检查设备类型
        const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent
        const isMobile = /(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/ig.test(userAgent)
        // const initData = [
        //     store.dispatch('setLogin')
        // ]
        // return Promise.all(initData)
    },
    setLogin({ commit }) {
        return axios.get('/api/auther')
            .then(response => {
                const success = Object.is(response.statusText, 'OK') && Object.is(response.data.code, 1)
                if (success) commit('REQUEST_setLogin_SUCCESS', response.data)
                if (!success) commit('REQUEST_setLogin_FAILURE')
            }, err => {
                commit('REQUEST_setLogin_FAILURE', err)
            })
    },

}
