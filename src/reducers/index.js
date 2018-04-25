import { combineReducers } from 'redux'

import user, * as fromUser from './user'

const reducers = combineReducers({
  user,
})

export default reducers

// User selectors.
export const isUserAuthenticated = state =>
  fromUser.isUserAuthenticated(state.user)
