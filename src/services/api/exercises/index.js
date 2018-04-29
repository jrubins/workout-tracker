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
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function createExercise({ data, jwt }) {
  return post(EXERCISES_API_ENDPOINT, {
    authToken: jwt,
    body: data,
  })
}

/**
 * Creates a new set for an exercise.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {Number} opts.exerciseId
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function createExerciseSet({ data, exerciseId, jwt }) {
  return post(`${EXERCISES_API_ENDPOINT}/${exerciseId}/sets`, {
    authToken: jwt,
    body: data,
  })
}

/**
 * Fetches all exercises.
 *
 * @param {Object} opts
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function fetchExercises({ jwt }) {
  return get(EXERCISES_API_ENDPOINT, {
    authToken: jwt,
  })
}
