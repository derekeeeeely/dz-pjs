import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Container from './components/container/layout';
import IBoundary from './components/container/boundaries';

const { Suspense, lazy } = React
const Armory = lazy(() => import('./pages/armory'))
const Dashboard = lazy(() => import('./pages/dashboard'))

const App = () => (
  <Container>
    <Suspense fallback={<div>loading...</div>}>
      <IBoundary>
        <Switch>
          <Route exact={true} path="/" component={Dashboard} />
          <Route path="/armory" component={Armory} />
        </Switch>
      </IBoundary>
    </Suspense>
  </Container>
)

export default App