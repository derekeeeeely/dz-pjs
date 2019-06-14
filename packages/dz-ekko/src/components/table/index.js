import React, { Component } from 'react'
import { Table as AntTable, Switch, Button, Icon } from 'antd'
import './index.scss'

export default class Table extends Component {

  getColumns = () => {
    const { columns, actions } = this.props
    const actionColumn = [{
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record) => {
        const column = actions.map(action => {
          switch (action.type) {
            case 'switch':
              return (<Switch
                key={action.title}
                className="action-item"
                defaultChecked={!!record[action.related]}
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                onChange={checked => action.cb(record, action.related, +checked)}
              />)
            case 'button':
              return (<Button
                key={action.title}
                className="action-item"
                onClick={event => action.cb(record)}
                size="small"
                type="primary"
              >
                {action.title}
              </Button>)
            default:
              return ''
          }
        })
        return column
      }
    }]
    return columns.concat(actionColumn).map(e => ({
      ...e,
      dataIndex: e.dataKey,
    }))
  }

  render() {
    const { dataSource } = this.props
    return (
      <div className="ekko-table">
        <AntTable
          columns={this.getColumns()}
          dataSource={dataSource}
        />
      </div>
    )
  }
}
