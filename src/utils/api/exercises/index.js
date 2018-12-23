import { apiDelete, get, patch, post } from '@jrubins/utils/lib/requests'
import _ from 'lodash'

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
 * Deletes an exercise.
 *
 * @param {Object} opts
 * @param {String} opts.id
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function deleteExercise({ id, jwt }) {
  return apiDelete(`${EXERCISES_API_ENDPOINT}/${id}`, {
    authToken: jwt,
  })
}

/**
 * Deletes a set for an exercise.
 *
 * @param {Object} opts
 * @param {Number} opts.exerciseId
 * @param {String} opts.jwt
 * @param {Number} opts.setId
 * @returns {Promise}
 */
export function deleteExerciseSet({ exerciseId, jwt, setId }) {
  return apiDelete(`${EXERCISES_API_ENDPOINT}/${exerciseId}/sets/${setId}`, {
    authToken: jwt,
  })
}

/**
 * Edits an existing set for an exercise.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {String} opts.data.id
 * @param {String} opts.exerciseId
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function editExerciseSet({ data, exerciseId, jwt }) {
  return patch(`${EXERCISES_API_ENDPOINT}/${exerciseId}/sets/${data.id}`, {
    authToken: jwt,
    body: _.omit(data, 'id'),
  })
}

/**
 * Fetches all exercises. Provide a date to filter exercises by date.
 *
 * @param {Object} opts
 * @param {Number} opts.date
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function fetchExercises({ date, jwt }) {
  return get(EXERCISES_API_ENDPOINT, {
    authToken: jwt,
    query: {
      date,
    },
  })
}
