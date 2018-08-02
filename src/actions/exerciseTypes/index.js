import {
  createExerciseType,
  editExerciseType,
} from '../../services/api/exerciseTypes'

import {
  REQUEST_SAVE_EXERCISE_TYPE,
  REQUEST_SAVE_EXERCISE_TYPE_FAIL,
  REQUEST_SAVE_EXERCISE_TYPE_SUCCESS,
} from '../'

/**
 * Creates an exercise type or edits an existing one.
 *
 * @param {Object} data
 * @returns {Object}
 */
export function saveExerciseType(data) {
  return {
    actionTypes: [
      REQUEST_SAVE_EXERCISE_TYPE,
      REQUEST_SAVE_EXERCISE_TYPE_SUCCESS,
      REQUEST_SAVE_EXERCISE_TYPE_FAIL,
    ],
    apiFn: data.id ? editExerciseType : createExerciseType,
    requestData: () => ({
      data,
    }),
  }
}
