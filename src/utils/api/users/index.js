import { post } from '@jrubins/utils/lib/requests'

/**
 * API endpoint for the user resource.
 *
 * @type {String}
 */
const USERS_API_ENDPOINT = '/users'

/**
 * Logs in a user.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @returns {Promise}
 */
export function login({ data }) {
  return post(`${USERS_API_ENDPOINT}/login`, {
    body: data,
  })
}

/**
 * Signs up a user.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @returns {Promise}
 */
export function signup({ data }) {
  return post(`${USERS_API_ENDPOINT}/signup`, {
    body: data,
  })
}
