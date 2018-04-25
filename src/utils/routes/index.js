import { stringToObject } from '../general'

/**
 * "Un-stringifies" the query part of a provided string.
 *
 * @param {String} search
 * @returns {Object}
 */
export function unStringifyQuery(search) {
  if (!search) {
    return {}
  }

  // Get rid of the "?" at the beginning.
  return stringToObject({
    propDelimiter: '&',
    value: search.substring(1),
    valueDelimiter: '=',
    valueProcessorFn: value => decodeURIComponent(value),
  })
}
