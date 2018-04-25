import { combineReducers } from 'redux'

function isAuthenticated(state = true, action) {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  isAuthenticated,
})

// Selectors.
export const isUserAuthenticated = state => state.isAuthenticated
