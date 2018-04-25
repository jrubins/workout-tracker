import { deleteMock, getMock, patchMock, postMock } from '../apiMock'
import { expectActionToMatchSnapshot } from '../redux'

/**
 * Mocks the provided API function and returns an expectation for the action.
 *
 * @param {Object} opts
 * @param {Function} opts.action
 * @param {Array} [opts.actionParams]
 * @param {Function} opts.apiMockFn
 * @param {Object} [opts.apiMockOpts]
 * @param {Boolean} [opts.isSuccess]
 * @param {String} opts.path
 * @param {Object} [opts.state]
 * @returns {Promise}
 */
function mockAndMatch({
  action,
  actionParams = [],
  apiMockFn,
  apiMockOpts = {},
  isSuccess = true,
  path,
  state = {},
}) {
  apiMockFn({
    ...apiMockOpts,
    path,
    isSuccess,
  })

  return expectActionToMatchSnapshot({
    action,
    actionParams,
    state,
  })
}

/**
 * Returns a test function for a CRUD delete action.
 *
 * @param {Object} opts
 * @returns {Promise}
 */
export function crudDelete(opts) {
  return mockAndMatch({
    ...opts,
    apiMockFn: deleteMock,
  })
}

/**
 * Returns a test function for a CRUD get action.
 *
 * @param {Object} opts
 * @returns {Promise}
 */
export function crudGet(opts) {
  return mockAndMatch({
    ...opts,
    apiMockFn: getMock,
  })
}

/**
 * Returns a test function for a CRUD patch action.
 *
 * @param {Object} opts
 * @returns {Promise}
 */
export function crudPatch(opts) {
  return mockAndMatch({
    ...opts,
    apiMockFn: patchMock,
  })
}

/**
 * Returns a test function for a CRUD post action.
 *
 * @param {Object} opts
 * @returns {Promise}
 */
export function crudPost(opts) {
  return mockAndMatch({
    ...opts,
    apiMockFn: postMock,
  })
}
