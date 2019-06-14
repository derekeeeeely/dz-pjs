import React, { Component } from 'react'
import axios from "axios"
import { Button, Input, Carousel, Spin } from "antd";
import styles from "./index.less"

export default class PandoraPage extends Component{
  constructor(props) {
    super(props)
    this.state = {
      imageUrls: [],
      searchValue: 1
    }
  }

  componentDidMount() {
    this.puppeteer()
  }

  puppeteer = () => {
    const { searchValue } = this.state
    this.setState((prevState) => {
      return {
        prevState,
        loading: true
      }
    })
    // this.loading = true
    axios
      .get(`http://127.0.0.1:1236/?url=${searchValue}`, { params: {} })
      .then(res => {
        this.setState({
          imageUrls: res.data.list || [],
          loading: false
        });
      });
  }

  inputChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  render() {
    const { imageUrls, loading } = this.state;
    return <div className="dz-pandora-test">
        <Input onChange={this.inputChange} className="search-value" onPressEnter={this.puppeteer} />
        <Button onClick={this.puppeteer} className="search-btn">
          Bing
        </Button>
        <Spin spinning={loading}>
          {imageUrls.length && <Carousel autoplay className="screenshot">
              {imageUrls.map(e => <div>
                  <img src={e} key={e} />
                </div>)}
            </Carousel>}
        </Spin>
      </div>;
  }
}