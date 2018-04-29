import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './pages/home/HomePage'
import Modal from './reusable/modals/Modal'

const App = () => (
  <div className="app-container">
    <Switch>
      <Route component={HomePage} exact path="/" />
    </Switch>

    <Modal />
  </div>
)

export default App
