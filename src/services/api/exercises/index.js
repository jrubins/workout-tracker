import { get, post } from '../'

/**
 * API endpoint for the exercise resource.
 *
 * @type {String}
 */
const EXERCISES_API_ENDPOINT = '/exercises'

/**
 * Creates a new exercise.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @returns {Promise}
 */
export function createExercise({ data }) {
  return post(EXERCISES_API_ENDPOINT, {
    body: data,
  })
}

/**
 * Creates a new set for an exercise.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {Number} opts.exerciseId
 * @returns {Promise}
 */
export function createExerciseSet({ data, exerciseId }) {
  return post(`${EXERCISES_API_ENDPOINT}/${exerciseId}/sets`, {
    body: data,
  })
}

/**
 * Fetches all exercises.
 *
 * @returns {Promise}
 */
export function fetchExercises() {
  return get(EXERCISES_API_ENDPOINT)
}
