import { combineReducers } from 'redux'
import _ from 'lodash'

import { LOG_OUT, REQUEST_LOGIN_SUCCESS } from '../../actions'

function isAuthenticated(state = false, action) {
  switch (action.type) {
    case LOG_OUT:
      return false

    case REQUEST_LOGIN_SUCCESS:
      return true

    default:
      return state
  }
}

function jwt(state = null, action) {
  switch (action.type) {
    case LOG_OUT:
      return null

    case REQUEST_LOGIN_SUCCESS:
      return _.get(action, 'data.jwt') || null

    default:
      return state
  }
}

export default combineReducers({
  isAuthenticated,
  jwt,
})

// Selectors.
export const getUserJwt = state => state.jwt
export const isUserAuthenticated = state => state.isAuthenticated
