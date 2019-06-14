import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/home";
import Code from "../pages/code";
import Life from "../pages/life";
import Maybe from "../pages/maybe";

const Main = () => (
  <div>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/code" component={Code} />
      <Route exact path="/life" component={Life} />
      <Route exact path="/maybe" component={Maybe} />
    </Switch>
  </div>
);

export default Main;
