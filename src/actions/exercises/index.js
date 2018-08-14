import {
  createExercise,
  createExerciseSet,
  editExerciseSet,
  fetchExercises as apiFetchExercises,
} from '../../services/api/exercises'

import {
  FETCH_EXERCISES,
  FETCH_EXERCISES_FAIL,
  FETCH_EXERCISES_SUCCESS,
  REQUEST_SAVE_EXERCISE,
  REQUEST_SAVE_EXERCISE_FAIL,
  REQUEST_SAVE_EXERCISE_SET,
  REQUEST_SAVE_EXERCISE_SET_FAIL,
  REQUEST_SAVE_EXERCISE_SET_SUCCESS,
  REQUEST_SAVE_EXERCISE_SUCCESS,
} from '../'

/**
 * Fetches all exercises.
 *
 * @returns {Object}
 */
export function fetchExercises() {
  return {
    actionTypes: [
      FETCH_EXERCISES,
      FETCH_EXERCISES_SUCCESS,
      FETCH_EXERCISES_FAIL,
    ],
    apiFn: apiFetchExercises,
  }
}

/**
 * Saves a new exercise.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function saveExercise(data) {
  return {
    actionTypes: [
      REQUEST_SAVE_EXERCISE,
      REQUEST_SAVE_EXERCISE_SUCCESS,
      REQUEST_SAVE_EXERCISE_FAIL,
    ],
    apiFn: createExercise,
    requestData: () => ({
      data,
    }),
  }
}

/**
 * Saves a new set for an exercise or edits an existing one.
 *
 * @param {Number} exerciseId
 * @param {Object} data
 * @param {String} [data.id]
 * @returns {Object}
 */
export function saveExerciseSet(exerciseId, data) {
  return {
    actionTypes: [
      REQUEST_SAVE_EXERCISE_SET,
      REQUEST_SAVE_EXERCISE_SET_SUCCESS,
      REQUEST_SAVE_EXERCISE_SET_FAIL,
    ],
    apiFn: data.id ? editExerciseSet : createExerciseSet,
    requestData: () => ({
      data,
      exerciseId,
    }),
  }
}
