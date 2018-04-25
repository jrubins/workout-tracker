import _ from 'lodash'

/**
 * Returns changed keys between the passed in data and existing data.
 *
 * @param {Object} opts
 * @param {Object} opts.existingData
 * @param {Object} opts.newData
 * @returns {Object}
 */
function getChangedResourceKeys(opts) {
  const { existingData, newData } = opts
  const changedKeys = _.pick(existingData, _.keys(newData))

  return _.pickBy(newData, (value, key) => !_.isEqual(value, changedKeys[key]))
}

/**
 * A mapping of API response codes to be more semantic.
 *
 * @type {Object}
 */
export const STATUS_CODES = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
}

/**
 * Delays an API request. Most useful for testing loading states during development.
 *
 * @param {Object} opts
 * @param {Number} opts.msTimeout
 * @param {Function} opts.resolveFn
 * @returns {Error}
 */
export function delayedApiRequest({ msTimeout, resolveFn }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resolveFn())
    }, msTimeout)
  })
}

/**
 * Gets data to save to an API depending on whether it's an edit or add operation.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @param {Function} opts.getResourceFn
 * @param {Object} state
 * @returns {Object}
 */
export function getApiSaveData({ data, getResourceFn, state }) {
  if (data.id) {
    const changedData = getChangedResourceKeys({
      existingData: getResourceFn(state, data.id),
      newData: data,
    })

    return _.isEmpty(changedData)
      ? {}
      : {
          ...changedData,
          id: data.id,
        }
  }

  return data
}

/**
 * Returns if the passed in param represents an API request error.
 *
 * @param {Object} param
 * @returns {Boolean}
 */
export function isApiRequestError(param) {
  return param instanceof Error
}

/**
 * Returns if the data to save to the API has NOT changed from the existing data.
 *
 * @param {Object} opts
 * @param {Object} opts.data
 * @returns {Boolean}
 */
export function isApiSaveDataUnchanged(opts) {
  return opts.data.id ? _.isEmpty(getApiSaveData(opts)) : false
}

/**
 * Makes an error object for an API request that failed.
 *
 * @param {Number} options.statusCode
 * @param {Object} options.json
 * @returns {Error}
 */
export function makeApiResponseError({ statusCode, json }) {
  const error = new Error(
    _.isArray(json.errors) ? json.errors[0] : 'Internal server error'
  )
  error.statusCode = statusCode
  error.data = json || {} // eslint-disable-line camelcase

  return error
}

/**
 * Stringifies the provided object for use in a query string.
 *
 * @param {Object} obj
 * @returns {String}
 */
export function queryStringify(obj) {
  return _.reduce(
    obj,
    (result, value, key) => {
      // If value is an object, its expected to have "operator" and "value" properties so we can construct a query
      // param of the form key[operator]=value.
      if (_.isObject(value)) {
        const { operator, value: queryParamValue } = value
        if (_.isUndefined(operator) || _.isUndefined(queryParamValue)) {
          throw new Error(
            `Object query param ${key} must have "operator" and "value" properties.`
          )
        }

        result.push(
          `${key}[${value.operator}]=${encodeURIComponent(value.value)}`
        )
      } else if (value) {
        result.push(`${key}=${encodeURIComponent(value)}`)
      }

      return result
    },
    []
  ).join('&')
}

/**
 * Transforms data into the format the API expects using the provided data.
 *
 * @param {Object} options.data
 * @param {Boolean} [options.onlyWithValue]
 * @returns {Object}
 */
export function transformFieldsForAPI({ data, onlyWithValue = true }) {
  let apiData = _.mapKeys(data, (value, key) => key)

  if (onlyWithValue) {
    apiData = _.pickBy(apiData, value => {
      // We allow any boolean values - don't consider that empty.
      if (_.isBoolean(value)) {
        return true
      }

      return value && (!_.isArray(value) || !_.isEmpty(value))
    })
  }

  return apiData
}
