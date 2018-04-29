import {
  createWeight,
  fetchWeight as apiFetchWeight,
} from '../../services/api/weight'

import {
  FETCH_WEIGHT,
  FETCH_WEIGHT_FAIL,
  FETCH_WEIGHT_SUCCESS,
  REQUEST_SAVE_WEIGHT,
  REQUEST_SAVE_WEIGHT_FAIL,
  REQUEST_SAVE_WEIGHT_SUCCESS,
} from '../'

/**
 * Fetches all weights.
 *
 * @returns {Object}
 */
export function fetchWeight() {
  return {
    actionTypes: [FETCH_WEIGHT, FETCH_WEIGHT_SUCCESS, FETCH_WEIGHT_FAIL],
    apiFn: apiFetchWeight,
  }
}

/**
 * Saves a new weight.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function saveWeight(data) {
  return {
    actionTypes: [
      REQUEST_SAVE_WEIGHT,
      REQUEST_SAVE_WEIGHT_SUCCESS,
      REQUEST_SAVE_WEIGHT_FAIL,
    ],
    apiFn: createWeight,
    requestData: () => ({
      data,
    }),
  }
}
