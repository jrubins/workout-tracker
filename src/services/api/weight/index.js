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
 * @returns {Promise}
 */
export function createWeight({ data }) {
  return post(WEIGHT_API_ENDPOINT, {
    body: data,
  })
}

/**
 * Fetches all weights.
 *
 * @returns {Promise}
 */
export function fetchWeight() {
  return get(WEIGHT_API_ENDPOINT)
}
