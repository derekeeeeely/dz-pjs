import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Material from './components/materials';
import MainDash from './components/maindash';
import './index.less';

const Dashboard = () => {
  return (
    <div className="alita-dash">
      <Material />
      <MainDash />
    </div>
  );
}

export default DragDropContext(HTML5Backend)(Dashboard)