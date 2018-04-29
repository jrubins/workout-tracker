import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import BottomNavigation from './reusable/navigation/BottomNavigation'
import ExercisesPage from './pages/exercises/ExercisesPage'
import Modal from './reusable/modals/Modal'
import WeightPage from './pages/weight/WeightPage'

const App = () => (
  <div className="app-container">
    <Switch>
      <Route component={ExercisesPage} exact path="/exercises" />
      <Route component={WeightPage} exact path="/weight" />

      <Redirect to="/exercises" />
    </Switch>

    <BottomNavigation />

    <Modal />
  </div>
)

export default App
