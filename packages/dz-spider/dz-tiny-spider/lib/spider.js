const Crawler = require('crawler')
const colors = require('colors/safe')
const axios = require('axios')
const { sqlquery } = require('./utils')

export default class Spider extends Crawler {
  constructor(props) {
    super(props)
  }

}

