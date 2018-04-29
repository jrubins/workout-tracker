import _ from 'lodash'
import fetch from 'isomorphic-fetch'
import hash from 'object-hash'

import { error, group } from '../../utils/logs'
import {
  makeApiResponseError,
  queryStringify,
  transformFieldsForAPI,
} from '../../utils/api'

/**
 * The base url for API requests.
 *
 * @type {String}
 */
const API_BASE_URL = process.env.API_BASE_URL

/**
 * The mimetype that represents JSON.
 *
 * @type {String}
 */
const JSON_MIME_TYPE = 'application/json'

/**
 * A cache for requests that are currently being made. The key is a hash of the API path being called and
 * the request body. The value is the Promise for the API request.
 *
 * @type {Object}
 */
const PENDING_REQUESTS = {}

/**
 * Checks for a request response error and throws an API error if one happened.
 *
 * @param {Object} response
 * @param {Object} [apiJsonResponse]
 * @throws Error
 */
function checkForRequestErrorAndThrow(response, apiJsonResponse = {}) {
  const hasError = response.status >= 400 && response.status <= 500

  if (hasError) {
    error(
      `Error making API request: ${response.statusText} (${response.status})`
    )

    throw makeApiResponseError({
      json: apiJsonResponse,
      statusCode: response.status,
    })
  }
}

/**
 * Returns the request body transformed and stringified.
 *
 * @param {Object} data
 * @param {Object} [opts]
 * @returns {String}
 */
function getStringifiedBody(data, opts = {}) {
  return JSON.stringify(
    transformFieldsForAPI({
      ...opts,
      data: data || {},
    })
  )
}

/**
 * Makes an API request to the provided path with the provided options.
 *
 * @param {Object} opts
 * @param {Object} opts.requestOptions
 * @param {Object} opts.requestOptions.headers
 * @param {String} opts.requestPath
 * @param {Function} [opts.responseParser]
 * @returns {Promise}
 */
async function makeRequest({
  requestOptions,
  requestPath,
  responseParser = null,
}) {
  // Make our AJAX request - allow external requests as well.
  const response = await fetch(requestPath, requestOptions)
  const expectingJson = requestOptions.headers.Accept === JSON_MIME_TYPE
  let apiResponse

  // If we're expecting JSON, parse it as such. Otherwise, allow the caller to parse.
  if (expectingJson) {
    try {
      // If this isn't JSON, it will through a fetch error. We want to capture
      // that and return a better error message.
      apiResponse = await response.json()
    } catch (err) {
      error('Expecting JSON response, received non-JSON.')

      throw makeApiResponseError({
        json: {
          errors: ['Received unexpected response type from API.'],
        },
        statusCode: response.status,
      })
    }
  } else if (_.isFunction(responseParser)) {
    apiResponse = await responseParser(response)
  }

  // The second argument here we only pass through if it's JSON (to attach JSON to the error if we have an error).
  checkForRequestErrorAndThrow(
    response,
    expectingJson ? apiResponse : undefined
  )

  return {
    data: apiResponse,
    headers: response.headers,
    status: response.status,
  }
}

/**
 * Prepares to make an API request. Handles protecting against multiple duplicate requests
 * in quick succession.
 *
 * @param {String} path
 * @param {Object} opts
 * @param {String} [opts.authToken]
 * @param {Boolean} [opts.isExternal]
 * @param {Object} [opts.query]
 * @param {Function} [opts.responseParser]
 * @param {Boolean} [opts.sendCookies]
 * @param {Boolean} [opts.skipDefaultHeaders]
 * @param {String} [opts.version]
 * @returns {Promise}
 */
async function prepareRequest(path, opts = {}) {
  const {
    authToken = null,
    isExternal = false,
    query = {},
    responseParser = null,
    sendCookies = false,
    skipDefaultHeaders = false,
    version = '',
  } = opts
  let requestPath = `${API_BASE_URL}${version}${path}`

  if (isExternal) {
    requestPath = path
  }

  // Add on our query string if we have data for it.
  if (!_.isEmpty(query)) {
    const transformedQueryFields = queryStringify(
      transformFieldsForAPI({
        data: query,
      })
    )

    requestPath = `${requestPath}${
      transformedQueryFields ? `?${transformedQueryFields}` : ''
    }`
  }

  // Add default headers unless we're skipping them.
  const headers = skipDefaultHeaders
    ? {}
    : {
        Accept: JSON_MIME_TYPE,
        'Content-Type': JSON_MIME_TYPE,
      }

  // Add our API Authorization header if provided.
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const requestOptions = _.merge({}, _.omit(opts, ['authToken', 'query']), {
    headers,
  })

  // Isomorphic-fetch doesn't send cookies in requests by default.
  if (sendCookies) {
    requestOptions.credentials = 'include'
  }

  // Calculate our request hash based off the request body and path. If we're
  // already making this exact request, let's not make it again.
  const requestHash = hash({
    body: requestOptions.body,
    requestPath,
  })
  const pendingRequest = PENDING_REQUESTS[requestHash]
  if (pendingRequest) {
    return pendingRequest
  }

  // Log a collapsed group for our API request. User can expand if they want.
  group(
    `API Request: ${requestOptions.method} ${requestPath}`,
    true,
    requestOptions
  )

  try {
    const apiRequest = makeRequest({
      headers,
      requestHash,
      requestPath,
      requestOptions,
      responseParser,
    })
    PENDING_REQUESTS[requestHash] = apiRequest

    return await apiRequest
  } finally {
    // Once the request is done, we want to clear the pending requests cache so we can make this request
    // again in the future.
    PENDING_REQUESTS[requestHash] = null
  }
}

/**
 * The different versions that the API supports. A caller can supply one of these to override the default.
 *
 * @type {Object}
 */
export const API_VERSIONS = {}

/**
 * Makes an API DELETE request.
 *
 * @param {String} path
 * @param {Object} opts
 * @returns {Promise}
 */
export function apiDelete(path, opts = {}) {
  const requestOptions = _.merge({}, opts, {
    method: 'DELETE',
  })

  return prepareRequest(path, requestOptions)
}

/**
 * Makes an API GET request.
 *
 * @param {String} path
 * @param {Object} opts
 * @returns {Promise}
 */
export function get(path, opts = {}) {
  const requestOptions = _.merge({}, opts, {
    method: 'GET',
  })

  return prepareRequest(path, requestOptions)
}

/**
 * Makes an API PATCH request.
 *
 * @param {String} path
 * @param {Object} opts
 * @returns {Promise}
 */
export function patch(path, opts = {}) {
  const { bodyNotJSON = false } = opts

  const requestOptions = _.merge({}, opts, {
    body: bodyNotJSON
      ? opts.body
      : // We allow empty values on PUTs since they may be deleting some previously set value.
        getStringifiedBody(opts.body, { onlyWithValue: false }),
    method: 'PATCH',
  })

  return prepareRequest(path, requestOptions)
}

/**
 * Makes an API POST request.
 *
 * @param {String} path
 * @param {Object} opts
 * @returns {Promise}
 */
export function post(path, opts = {}) {
  const requestOptions = _.merge({}, opts, {
    body: getStringifiedBody(opts.body, opts.bodyOpts),
    method: 'POST',
  })

  return prepareRequest(path, requestOptions)
}
