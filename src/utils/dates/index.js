import _ from 'lodash'
import moment from 'moment'

/**
 * The default date format.
 *
 * @type {String}
 */
export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY'

/**
 * Formats the provided time into a date string (default MM/DD/YYYY).
 * If a timestamp is provided, it should be seconds since the Epoch.
 *
 * @param {String|Number} timestamp
 * @param {String} [dateFormat]
 * @param {Object} [opts]
 * @param {String} [opts.parseFormat] The format to use to parse the provided timestamp.
 * @returns {String}
 */
export function formatDate(
  timestamp,
  dateFormat = DEFAULT_DATE_FORMAT,
  { parseFormat = null } = {}
) {
  const momentToFormat = moment(
    _.isNumber(timestamp) ? timestamp * 1000 : timestamp,
    parseFormat
  )

  return momentToFormat.format(dateFormat)
}

/**
 * Returns the number of seconds from the Epoch for the given date.
 *
 * @param {Date|String|Number} date
 * @returns {Number}
 */
export function getTimestamp(date) {
  return moment(date).unix()
}
