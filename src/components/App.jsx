import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { error } from '@jrubins/utils/lib/logs'

import { UserContext } from './contexts'
// import AnalyzePage from './pages/analyze/AnalyzePage'
import ExercisesPage from './pages/exercises/ExercisesPage'
import LoginPage from './pages/login/LoginPage'
import LogoutPage from './pages/logout/LogoutPage'
import SignupPage from './pages/signup/SignupPage'
import WeightPage from './pages/weight/WeightPage'

// Load the user's initial authentication state.
let initialJwt = null
try {
  initialJwt = localStorage.getItem('rcc-user-jwt')
} catch (e) {
  error('Failed to retrieve initialize state from localStorage:', e)
}

const App = () => {
  const [jwt, setJwt] = useState(initialJwt)
  useEffect(
    () => {
      try {
        if (jwt) {
          localStorage.setItem('rcc-user-jwt', jwt)
        } else {
          localStorage.removeItem('rcc-user-jwt')
        }
      } catch (e) {
        error('Unable to persist state to localStorage:', e)
      }
    },
    [jwt]
  )

  return (
    <UserContext.Provider value={{ jwt, setJwt }}>
      <div className="app-container">
        <Switch>
          {/* <Route component={AnalyzePage} exact path="/analyze" />*/}
          <Route component={ExercisesPage} exact path="/exercises" />
          <Route component={LoginPage} exact path="/login" />
          <Route component={LogoutPage} exact path="/logout" />
          <Route component={SignupPage} exact path="/signup" />
          <Route component={WeightPage} exact path="/weight" />

          <Redirect to="/exercises" />
        </Switch>
      </div>
    </UserContext.Provider>
  )
}

export default App
