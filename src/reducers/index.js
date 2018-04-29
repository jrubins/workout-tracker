import { combineReducers } from 'redux'

import exercises, * as fromExercises from './exercises'
import modal, * as fromModal from './modal'
import user, * as fromUser from './user'
import weight, * as fromWeight from './weight'

const reducers = combineReducers({
  exercises,
  modal,
  user,
  weight,
})

export default reducers

// Exercises selectors.
export const getExerciseById = (state, id) =>
  fromExercises.getExerciseById(state.exercises, id)
export const getExercises = state => fromExercises.getExercises(state.exercises)

// Modal selectors.
export const getModalOpts = state => fromModal.getModalOpts(state.modal)
export const isModalOpen = state => fromModal.isModalOpen(state.modal)

// User selectors.
export const isUserAuthenticated = state =>
  fromUser.isUserAuthenticated(state.user)

// Weight selectors.
export const getWeight = state => fromWeight.getWeight(state.weight)
