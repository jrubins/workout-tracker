import { combineReducers } from 'redux'

import { createDataReducer } from '../../utils/redux'

import {
  FETCH_WEIGHT_SUCCESS,
  REQUEST_SAVE_WEIGHT_SUCCESS,
} from '../../actions'

export default combineReducers({
  data: createDataReducer({
    saveActionTypes: {
      [FETCH_WEIGHT_SUCCESS]: '',
      [REQUEST_SAVE_WEIGHT_SUCCESS]: '',
    },
  }),
})

// Selectors.
export const getWeight = state => state.data
