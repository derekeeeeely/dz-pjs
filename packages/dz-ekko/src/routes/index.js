import React from 'react'
import { Switch, Route } from 'react-router-dom'
// import routeConfig from '../../config/routeconfig'
import SearchTest from 'pages/searchTest'
import FormTest from 'pages/formTest'
import DrawerTest from 'pages/drawerTest'
// routeConfig.map(route => {

// })

const Main = () => (
  <div>
    <Switch>
      <Route exact path="/search" component={SearchTest} />
      <Route exact path="/form" component={FormTest} />
      <Route exact path="/drawer" component={DrawerTest} />
    </Switch>
  </div>
)

export default Main
