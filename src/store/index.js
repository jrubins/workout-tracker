import { applyMiddleware, compose, createStore } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'

import makeApiRequest from './middleware/makeApiRequest'

import { isLocal } from '../utils/environment'

import reducers from '../reducers'

/**
 * Creates the redux store.
 *
 * @returns {Object}
 */
export function configureStore() {
  return createStore(
    reducers,
    undefined,
    compose(
      // Allows us to use asynchronous actions.
      applyMiddleware(thunk),

      // Allows us to make API requests to our API.
      applyMiddleware(makeApiRequest),

      // Persists specified state to local storage.
      persistState([
        'user',
      ], {
        slicer: () => state => ({
          user: {
            isAuthenticated: state.user.isAuthenticated,
          },
        }),
      }),

      // Enables the Chrome Redux dev tools extension. It's awesome.
      isLocal() &&
      typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined'
        ? window.devToolsExtension()
        : f => f
    )
  )
}
