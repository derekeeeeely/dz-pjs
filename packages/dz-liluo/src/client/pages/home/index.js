import React, { Component } from "react"
import axios from "axios"
import { Button, Upload, message, Table } from 'antd'
import CSSModules from "react-css-modules";
import ReactEcharts from 'echarts-for-react';
import styles from "./index.less";

const options = {
  title: {
    text: '基础雷达图'
  },
  tooltip: {},
  legend: {
    data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
  },
  radar: {
    // shape: 'circle',
    indicator: [
        { name: '销售（sales）', max: 6500},
        { name: '管理（Administration）', max: 16000},
        { name: '信息技术（Information Techology）', max: 30000},
        { name: '客服（Customer Support）', max: 38000},
        { name: '研发（Development）', max: 52000},
        { name: '市场（Marketing）', max: 25000}
    ]
  },
  series: [{
    name: '预算 vs 开销（Budget vs spending）',
    type: 'radar',
    // areaStyle: {normal: {}},
    data : [
      {
        value : [4300, 10000, 28000, 35000, 50000, 19000],
        name : '预算分配（Allocated Budget）'
      },
        {
        value : [5000, 14000, 28000, 31000, 42000, 21000],
        name : '实际开销（Actual Spending）'
      }
    ]
  }]
}

const columns = [{ title: "orderId", dataIndex: "orderId", width: "30%", key: "orderId" }, { title: "ems", dataIndex: "ems", width: "30%", key: "ems" }, { title: "trackId", dataIndex: "trackId", width: "30%", key: "trackId" }];

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList: []
    }
  }

  componentDidMount() {
    this.search()
  }

  search = () => {
    axios
      .get("/api/test/list", { params: {} })
      .then(res => {
        this.setState({
          orderList: res.data.data || []
        })
      });
  }



  render() {
    const { orderList } = this.state
    return <div className="dz-liluo-main">
        <Upload showUploadList={false} name="file" action="/api/upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={info => {
            if (info.file.status === "done") {
              if (!info.file.response.success) {
                message.error(<pre>
                    {info.file.response.errorMessage}
                  </pre>, 5);
              } else {
                message.success("导入成功");
                this.search()
              }
            } else if (info.file.status === "error") {
              message.error(`文件 ${info.file.name} 导入失败.`);
            }
          }}>
          <Button className="import">导入</Button>
        </Upload>
        <Button className="show" onClick={this.search}>
          搜索
        </Button>
        {/*<Table pagination={false} columns={columns} dataSource={orderList} size="small" className="test-table"/>
        <ReactEcharts option={options} />*/}
      </div>;
  }
}
