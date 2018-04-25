import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import makeApiRequest from '../../../store/middleware/makeApiRequest'

const mockStore = configureStore([thunk, makeApiRequest])

/**
 * Mocks a Redux store using the passed in state.
 *
 * @param {Object} state
 * @returns {Store}
 */
export function getMockStore(state) {
  return mockStore({
    user: {
      isAuthenticated: true,
    },
    ...state,
  })
}

/**
 * Mocks a store and dispatches the passed in action. Expects the actions snapshot to match.
 *
 * @param {Object} opts
 * @param {Function} opts.action
 * @param {Array} [opts.actionParams]
 * @param {Object} [opts.state]
 * @returns {Promise}
 */
export async function expectActionToMatchSnapshot(opts) {
  const { action, actionParams = [], state = {} } = opts
  const store = getMockStore(state)

  await store.dispatch(action(...actionParams))

  expect(store.getActions()).toMatchSnapshot()

  return true
}
