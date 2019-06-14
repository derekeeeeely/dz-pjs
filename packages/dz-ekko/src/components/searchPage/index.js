import React, { Component } from 'react'
import { observer } from 'mobx-react';
import Search from '../search'
import Table from '../table'
import { fetchJSONByPost } from 'utils/ajax'

@observer
export default class SearchPage extends Component {
  search = (values) => {
    const { search: { url } } = this.props
    this.props.store.getData(url, values)
  }

  getActions = () => {
    const { table: { actions = [] }  } = this.props
    return actions.map(action => ({
      ...action,
      cb: this.columnAction(action.url)
    }))
  }

  columnAction = url => (row, type, value) => {
    const params = { id: row.id }
    if (type) {
      params[type] = value
    }
    fetchJSONByPost(url, params).then(() => {
      this.searchBar.onSearch()
    })
  }

  render() {
    const { search: { fields = [] }, table: { columns = [] } }= this.props
    const dataSource = this.props.store.data || []
    return (
      <div>
        <Search
          ref={r => this.searchBar = r}
          fields={fields}
          onSearch={this.search}
        />
        <Table
          columns={columns}
          actions={this.getActions()}
          dataSource={dataSource || []}
        />
      </div>
    )
  }
}
