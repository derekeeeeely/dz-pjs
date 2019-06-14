import * as _ from 'lodash';
import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

// drag source
const source = {
  beginDrag(props: any, monitor: any, component: any) {
    return {
      ...props,
      material: monitor.getInitialClientOffset().x < 350,
    };
  }
};

// drag inject
const collect = (connect: any, monitor: any) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

// drop target
const droptarget = {
  drop(props: any, monitor: any, component: any) {
    if (props.onDrop && _.isFunction(props.onDrop)) {
      const newIndex = props.index
      props.onDrop(monitor.getItem(), newIndex);
    }
  }
}

// drop inject
const dropcollect = (connect: any, monitor: any) => {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
  }
}

// dnd item
const AltItem = (props: any) => {
  const { connectDragSource, connectDropTarget } = props;
  return connectDropTarget(connectDragSource(
    <div>
      {props.children}
    </div>
  ))
};

export default DropTarget('bullet', droptarget, dropcollect)(DragSource('bullet', source, collect)(AltItem))
