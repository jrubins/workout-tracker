import { get, post } from '../'

/**
 * API endpoint for the weight resource.
 *
 * @type {String}
 */
const WEIGHT_API_ENDPOINT = '/weight'

/**
 * Creates a new weight.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function createWeight({ data, jwt }) {
  return post(WEIGHT_API_ENDPOINT, {
    authToken: jwt,
    body: data,
  })
}

/**
 * Fetches all weights.
 *
 * @param {Object} opts
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function fetchWeight({ jwt }) {
  return get(WEIGHT_API_ENDPOINT, {
    authToken: jwt,
  })
}
