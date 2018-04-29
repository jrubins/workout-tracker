import { combineReducers } from 'redux'
import _ from 'lodash'

import { createDataReducer } from '../../utils/redux'

import {
  FETCH_EXERCISES_SUCCESS,
  REQUEST_SAVE_EXERCISE_SET_SUCCESS,
  REQUEST_SAVE_EXERCISE_SUCCESS,
} from '../../actions'

export default combineReducers({
  data: createDataReducer({
    saveActionTypes: {
      [FETCH_EXERCISES_SUCCESS]: '',
      [REQUEST_SAVE_EXERCISE_SUCCESS]: '',
      [REQUEST_SAVE_EXERCISE_SET_SUCCESS]: '',
    },
  }),
})

// Selectors.
export const getExerciseById = (state, id) =>
  _.find(getExercises(state), { id })
export const getExercises = state => state.data
