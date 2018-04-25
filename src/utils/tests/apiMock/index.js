import nock from 'nock'

/**
 * Mocks an HTTP request using nock.
 *
 * @param {Object} opts
 * @param {Object} [opts.body]
 * @param {Boolean} opts.isSuccess
 * @param {String} opts.method
 * @param {String} opts.path
 * @param {Object} [opts.query]
 * @param {String} [opts.version]
 * @returns {Object}
 */
function nockMock(opts) {
  const {
    apiResponseCode = null,
    apiResultData = {},
    body = null,
    headers = null,
    isSuccess = true,
    method,
    path,
    query = null,
    version = '',
  } = opts
  const responseCode = apiResponseCode || (isSuccess ? 200 : 500)
  const requestArgs = [path]
  const initOpts = {}

  if (headers) {
    initOpts.reqheaders = headers
  }

  if (body) {
    requestArgs.push(body)
  }

  const nockMock = nock(`${API_BASE_URL_TEST}/${version}`, initOpts)[method](
    ...requestArgs
  )

  if (query) {
    nockMock.query(query)
  }

  return nockMock.reply(responseCode, apiResultData)
}

/**
 * The base URL for API requests for tests.
 *
 * @type {String}
 */
export const API_BASE_URL_TEST = 'http://test.com'

/**
 * Mocks a DELETE request.
 *
 * @param {Object} opts
 * @returns {Object}
 */
export function deleteMock(opts) {
  return nockMock({
    ...opts,
    method: 'delete',
  })
}

/**
 * Mocks a GET request.
 *
 * @param {Object} opts
 * @returns {Object}
 */
export function getMock(opts) {
  return nockMock({
    ...opts,
    method: 'get',
  })
}

/**
 * Mocks a PATCH request.
 *
 * @param {Object} opts
 * @returns {Object}
 */
export function patchMock(opts) {
  return nockMock({
    ...opts,
    method: 'patch',
  })
}

/**
 * Mocks a POST request.
 *
 * @param {Object} opts
 * @returns {Object}
 */
export function postMock(opts) {
  return nockMock({
    ...opts,
    method: 'post',
  })
}
