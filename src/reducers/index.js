import { combineReducers } from 'redux'
import _ from 'lodash'

import exercises, * as fromExercises from './exercises'
import exerciseTypes, * as fromExerciseTypes from './exerciseTypes'
import modal, * as fromModal from './modal'
import user, * as fromUser from './user'
import weight, * as fromWeight from './weight'

const reducers = combineReducers({
  exercises,
  exerciseTypes,
  modal,
  user,
  weight,
})

export default reducers

// Exercises selectors.
export const getExerciseById = (state, id) => {
  const exercise = fromExercises.getExerciseById(state.exercises, id)
  if (exercise) {
    return {
      ...exercise,
      exerciseType: getExerciseTypeById(state, exercise.exerciseType),
    }
  }
}
export const getExerciseSetById = (state, exerciseId, setId) => {
  const exercise = fromExercises.getExerciseById(state.exercises, exerciseId)
  if (exercise) {
    return _.find(exercise.sets, { _id: setId })
  }
}
export const getExercises = state => {
  const exercises = fromExercises.getExercises(state.exercises)

  return _.map(exercises, exercise => ({
    ...exercise,
    exerciseType: getExerciseTypeById(state, exercise.exerciseType),
  }))
}

// Exercise types selectors.
export const getExerciseTypes = state =>
  fromExerciseTypes.getExerciseTypes(state.exerciseTypes)
export const getExerciseTypeById = (state, id) =>
  fromExerciseTypes.getExerciseTypeById(state.exerciseTypes, id)

// Modal selectors.
export const getModalOpts = state => fromModal.getModalOpts(state.modal)
export const isModalOpen = state => fromModal.isModalOpen(state.modal)

// User selectors.
export const getUserJwt = state => fromUser.getUserJwt(state.user)
export const isUserAuthenticated = state =>
  fromUser.isUserAuthenticated(state.user)

// Weight selectors.
export const getWeight = state => fromWeight.getWeight(state.weight)
