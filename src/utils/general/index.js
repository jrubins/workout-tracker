import _ from 'lodash'

/**
 * Converts the provided string value into an object, split by the delimiters.
 *
 * @param {Object} opts
 * @param {String} opts.propDelimiter
 * @param {String} [opts.value]
 * @param {String} opts.valueDelimiter
 * @param {Function} [opts.valueProcessorFn]
 * @returns {Object}
 */
export function stringToObject({
  propDelimiter,
  value,
  valueDelimiter,
  valueProcessorFn = null,
}) {
  if (!value) {
    return {}
  }

  return value.split(propDelimiter).reduce((queryObj, term) => {
    const termArr = term.split(valueDelimiter)
    const termValue = termArr[1]

    return {
      ...queryObj,
      [termArr[0]]: _.isFunction(valueProcessorFn)
        ? valueProcessorFn(termValue)
        : termValue,
    }
  }, {})
}
