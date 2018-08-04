import { combineReducers } from 'redux'
import _ from 'lodash'

import { createDataReducer } from '../../utils/redux'

import {
  FETCH_EXERCISES_SUCCESS,
  REQUEST_SAVE_EXERCISE_TYPE_SUCCESS,
} from '../../actions'

export default combineReducers({
  data: createDataReducer({
    saveActionTypes: {
      [FETCH_EXERCISES_SUCCESS]: data => _.map(data, 'exerciseType'),
      [REQUEST_SAVE_EXERCISE_TYPE_SUCCESS]: '',
    },
  }),
})

// Selectors.
export const getExerciseTypes = state => state.data
export const getExerciseTypeById = (state, id) =>
  _.find(getExerciseTypes(state), { id })
