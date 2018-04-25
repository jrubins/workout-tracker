import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './pages/home/HomePage'

const App = () => (
  <div className="app-container">
    <Switch>
      <Route component={HomePage} exact path="/" />
    </Switch>
  </div>
)

export default App
