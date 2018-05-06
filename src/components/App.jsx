import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import AnalyzePage from './pages/analyze/AnalyzePage'
import ExercisesPage from './pages/exercises/ExercisesPage'
import LoginPage from './pages/login/LoginPage'
import LogoutPage from './pages/logout/LogoutPage'
import Modal from './reusable/modals/Modal'
import SignupPage from './pages/signup/SignupPage'
import WeightPage from './pages/weight/WeightPage'

const App = () => (
  <div className="app-container">
    <Switch>
      <Route component={AnalyzePage} exact path="/analyze" />
      <Route component={ExercisesPage} exact path="/exercises" />
      <Route component={LoginPage} exact path="/login" />
      <Route component={LogoutPage} exact path="/logout" />
      <Route component={SignupPage} exact path="/signup" />
      <Route component={WeightPage} exact path="/weight" />

      <Redirect to="/exercises" />
    </Switch>

    <Modal />
  </div>
)

export default App
