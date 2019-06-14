import * as React from 'react';
import AltItem from 'components/bullets/dnd';
import list from './list'
import './index.less'

const generateList = () => {
  return list.map(item => {
    const Comp = item.component.default
    return <AltItem
      key={item.key}
      children={<Comp options={item.options}/>}
      options={item.options}
    />
  })
}


export default function Material(props: any) {
  return (
    <div className="alita-material-list">
      <div className="title">Alita Materials</div>
      <div className="list">
        {generateList()}
      </div>
    </div>
  );
}
