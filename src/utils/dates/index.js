import _ from 'lodash'
import moment from 'moment'

/**
 * The default date format.
 *
 * @type {String}
 */
export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY'

/**
 * Transforms the provided date into a consumable format for Moment.
 *
 * @param {Date|String|Number} date
 * @returns {Date|String|Number}
 */
function transformDate(date) {
  // If it's a number and looks like seconds, let's convert to milliseconds.
  return _.isNumber(date) && `${date}`.length === 10 ? date * 1000 : date
}

/**
 * Adds the specified amount of time to the passed in date.
 *
 * @param {Date|String|Number} date
 * @param {Object} opts
 * @param {Number} opts.duration
 * @param {String} opts.unit
 * @returns {Number}
 */
export function addToDate(date, { duration, unit }) {
  return moment(transformDate(date)).add(duration, unit)
}

/**
 * Returns the end of the passed in date.
 *
 * @param {Date|String|Number} date
 * @returns {Number}
 */
export function endOfDay(date) {
  return moment(transformDate(date)).endOf('day')
}

/**
 * Formats the provided time into a date string (default MM/DD/YYYY).
 * If a timestamp is provided, it should be seconds since the Epoch.
 *
 * @param {String|Number} date
 * @param {String} [dateFormat]
 * @param {Object} [opts]
 * @param {String} [opts.parseFormat] The format to use to parse the provided date.
 * @returns {String}
 */
export function formatDate(
  date,
  dateFormat = DEFAULT_DATE_FORMAT,
  { parseFormat = null } = {}
) {
  const momentToFormat = moment(transformDate(date), parseFormat)

  return momentToFormat.format(dateFormat)
}

/**
 * Returns the number of milliseconds from the Epoch for the given date.
 *
 * @param {Date|String|Number} date
 * @returns {Number}
 */
export function getTimestamp(date) {
  return moment(transformDate(date)).unix()
}

/**
 * Returns if the dateToCheck is within the day range for the provided day.
 *
 * @param {Date|String|Number} dateToCheck
 * @param {Date|String|Number} dayForRange
 * @returns {Boolean}
 */
export function isWithinDayRange(dateToCheck, dayForRange) {
  const dateToCheckTimestamp = getTimestamp(dateToCheck)

  return (
    dateToCheckTimestamp >= getTimestamp(startOfDay(dayForRange)) &&
    dateToCheckTimestamp <= getTimestamp(endOfDay(dayForRange))
  )
}

/**
 * Returns the start of the passed in date.
 *
 * @param {Date|String|Number} date
 * @returns {Number}
 */
export function startOfDay(date) {
  return moment(transformDate(date)).startOf('day')
}
