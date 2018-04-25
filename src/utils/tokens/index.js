import jwtDecode from 'jwt-decode'

import { error } from '../logs'
import { getTimestamp } from '../dates'

/**
 * Decodes the provided JWT token.
 *
 * @param {String} jwt
 * @returns {Object}
 */
export function decodeJwt(jwt) {
  if (!jwt) {
    return {}
  }

  try {
    // An invalid JWT throws an error when we attempt to decode.
    return jwtDecode(jwt)
  } catch (e) {
    error('Could not decode provided JWT. Returning an empty object.')

    return {}
  }
}

/**
 * Returns the number of seconds until the token expires.
 *
 * @param {String} jwt
 * @returns {Number}
 */
export function getSecondsTilTokenExpires(jwt) {
  const { exp } = decodeJwt(jwt)
  const now = getTimestamp(Date.now())

  return exp - now
}
