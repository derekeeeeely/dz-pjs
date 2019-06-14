import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/home";
import PandoraPage from '../pages/pandora'

const Main = () => (
  <div>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/pandora" component={PandoraPage} />
    </Switch>
  </div>
);

export default Main;
