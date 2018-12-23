import { get } from '@jrubins/utils/lib/requests'

/**
 * Fetches attendance data.
 *
 * @param {Object} opts
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function analyzeAttendance({ jwt }) {
  return get('/analyze/attendance', {
    authToken: jwt,
  })
}

/**
 * Fetches weight data.
 *
 * @param {Object} opts
 * @param {String} opts.jwt
 * @returns {Promise}
 */
export function analyzeWeight({ jwt }) {
  return get('/analyze/weight', {
    authToken: jwt,
  })
}
