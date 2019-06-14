import * as _ from 'lodash';
import * as React from 'react';
import { DropTarget } from 'react-dnd';
import { Icon } from 'antd';
import AltItem from 'components/bullets/dnd';

const target = {
  drop(props: any, monitor: any, component: any) {
    props.onLeftDrop(monitor.getItem());
  }
}

const collect = (connect: any, monitor: any) => {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
  }
}

const AltDash = (props: any) => {
  const { connectDropTarget, fields, current } = props;
  return connectDropTarget(
    <div className="dash-area">
      {fields.map((field: any, inx: number) => (
        <div
          onClick={() => { props.handleClick(field) }}
          key={inx}
          className={inx === current.index ? 'choosen' : ''}
        >
          <Icon
            className="close-icon"
            type="close-circle"
            onClick={(e) => {
              e.stopPropagation();
              props.handleDelete(field.index);
            }}
          />
          <AltItem
            {...field}
            onDrop={props.onInnerDrop}
          />
        </div>
      ))}
    </div>
  );
}

export default DropTarget('bullet', target, collect)(AltDash)
