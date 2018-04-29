import {
  login as apiLogin,
  signup as apiSignup,
} from '../../services/api/users'

import {
  LOG_OUT,
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAIL,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_SIGNUP,
  REQUEST_SIGNUP_FAIL,
  REQUEST_SIGNUP_SUCCESS,
} from '../'

/**
 * Logs in a user.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function login(data) {
  return {
    actionTypes: [REQUEST_LOGIN, REQUEST_LOGIN_SUCCESS, REQUEST_LOGIN_FAIL],
    apiFn: apiLogin,
    isPublic: true,
    requestData: () => ({
      data,
    }),
  }
}

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Object}
 */
export function logout() {
  return {
    type: LOG_OUT,
  }
}

/**
 * Signs up a user.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function signup(data) {
  return {
    actionTypes: [REQUEST_SIGNUP, REQUEST_SIGNUP_SUCCESS, REQUEST_SIGNUP_FAIL],
    apiFn: apiSignup,
    isPublic: true,
    requestData: () => ({
      data,
    }),
  }
}
