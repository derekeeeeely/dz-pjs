import * as _ from 'lodash';
import * as React from 'react';
import AltDash from './dash';
import SettingForm from './form';
import Operation from './operation'
import './index.less'

const { useState } = React;
export interface AltDashConfig {
  props?: any,
  index: number
  material: boolean,
  options: [],
}


export default function Maindash(props: any) {
  const [fields, changeFields] = useState<AltDashConfig[]>([]);
  const [current, changeCurrent] = useState();

  const handleLeftDrop = (item: AltDashConfig, sourceOffset: any) => {
    // 来自左侧
    if (item.material) {
      item.index = fields.length
      fields.push(item)
    }
    changeFields(fields)
  }

  const handleClick = (field: any) => {
    changeCurrent(field)
  }

  const handleDelete = (index: number) => {
    fields.splice(index, 1)
    const newFields = fields.map((item, inx) => ({
      ...item,
      index: inx
    }))
    changeFields(newFields)
    if (current && current.index === index) {
      changeCurrent(null)
    }
  }

  const handleInnerDrop = (item: AltDashConfig, newIndex: any) => {
    const oldIndex = item.index
    const deleted = fields.splice(oldIndex, 1)[0]
    const inx = fields.findIndex((fitem: any): boolean => fitem.index === newIndex)
    fields.splice(oldIndex > newIndex ? inx : inx + 1, 0, deleted)
    fields.map((fitem, finx) => fitem.index = finx)
    changeFields(fields)
    changeCurrent({ ...item, index: newIndex })
  }

  return (
    <div className="alita-maindash">
      <div className="canvas-area">
        <div className="title">Alita Dashboard</div>
        <AltDash
          onLeftDrop={handleLeftDrop}
          onInnerDrop={handleInnerDrop}
          fields={fields}
          current={current || {}}
          handleClick={handleClick}
          handleDelete={handleDelete}
        />
        <div className="operation-area">
          <Operation />
        </div>
      </div>
      <div className="content-area">
        <div className="title">{_.isNil(current) ? '' : `Area-${current.index} Settings`}</div>
        <SettingForm options={current ? current.options : []} />
      </div>
    </div>
  );
}

