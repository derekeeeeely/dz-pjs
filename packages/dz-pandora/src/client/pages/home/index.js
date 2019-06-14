import React, { Component } from "react"
import { inject, observer } from "mobx-react";
import { Icon, Collapse } from "antd";
import styles from './index.less'

const Panel = Collapse.Panel;
@inject("juejinStore")
@observer
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.juejinStore.getEssay();
  }

  render() {
    const { juejinList } = this.props.juejinStore
    return <div className="dz-pandora-main">
      <Collapse defaultActiveKey={['juejin']}>
        <Panel key="juejin" header={<div className="title"><Icon type="html5" />  Juejin Today</div>}>
          { juejinList && juejinList.map(e => (
            <div className="juejin-essay">
              <a href={e.href} target="_blank">
                {e.title}
              </a>
            </div>
          ))}
        </Panel>
      </Collapse>
    </div>;
  }
}
