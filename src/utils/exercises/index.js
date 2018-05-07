/**
 * Returns a formatted pace string for the provided time.
 *
 * @param {Number} time
 * @param {String} [timeUnit]
 * @returns {String}
 */
export function getTimeDisplay(time, timeUnit = 'min') {
  const timeMin = Math.floor(time)
  const timeSec = Math.ceil((time - timeMin) * 60)

  return `${timeMin}${timeSec ? `:${timeSec}` : ''} ${timeUnit}`
}
