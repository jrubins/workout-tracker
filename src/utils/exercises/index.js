/**
 * Returns a formatted pace string for the provided time.
 *
 * @param {Number} time
 * @param {String} [timeUnit]
 * @returns {String}
 */
export function getTimeDisplay(time, timeUnit = 'min') {
  const timeMin = Math.floor(time)
  let timeSec = (time - timeMin) * 60
  if (timeSec >= 10) {
    timeSec = Math.ceil(timeSec)
  } else {
    timeSec = `0${Math.floor(timeSec)}`
  }

  return `${timeMin}${timeSec ? `:${timeSec}` : ''} ${timeUnit}`
}
