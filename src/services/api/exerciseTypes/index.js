import { get, patch, post } from '../'

/**
 * API endpoint for the exercise type resource.
 *
 * @type {String}
 */
const EXERCISE_TYPES_API_ENDPOINT = '/exercise_types'

/**
 * Creates a new exercise type.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function createExerciseType({ data, jwt }) {
  return post(EXERCISE_TYPES_API_ENDPOINT, {
    authToken: jwt,
    body: data,
  })
}

/**
 * Edits an exercise type.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {String} opts.data.id
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function editExerciseType({ data, jwt }) {
  return patch(`${EXERCISE_TYPES_API_ENDPOINT}/${data.id}`, {
    authToken: jwt,
    body: data,
  })
}

/**
 * Fetches existing exercise types.
 *
 * @param {Object} opts
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function fetchExerciseTypes({ jwt }) {
  return get(EXERCISE_TYPES_API_ENDPOINT, {
    authToken: jwt,
  })
}
