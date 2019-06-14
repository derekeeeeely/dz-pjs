import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MusicBase from '../pages/music'

const Main = () => (
  <div>
    <Switch>
      <Route exact path="/music" component={MusicBase}/>
    </Switch>
  </div>
)

export default Main
