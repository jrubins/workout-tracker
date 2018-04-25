import _ from 'lodash'

import { error } from '../../utils/logs'
import { STATUS_CODES } from '../../utils/api'

import { isUserAuthenticated } from '../../reducers'
import { LOG_OUT } from '../../actions'

/**
 * Redux middleware to make an API request.
 *
 * @returns {Function}
 */
function makeApiRequest() {
  return ({ dispatch, getState }) => next => async action => {
    if (Array.isArray(action.actionTypes)) {
      const {
        actionPropsFn = null,
        actionTypes,
        apiFn,
        isCachedFn = null,
        isPublic = false,
        preRequestActions = null,
        requestData = null,
        successCb = null,
      } = action
      let state = getState()

      // May want to do some synchronous pre-request actions. Allow that because we're nice.
      if (_.isFunction(preRequestActions)) {
        preRequestActions(dispatch, state)
      }

      state = getState()
      const isAuthenticated = isUserAuthenticated(state)
      const [loadingActionType, successActionType, failActionType] = actionTypes
      // See if we want to include any other action props.
      const actionProps = _.isFunction(actionPropsFn)
        ? actionPropsFn(state)
        : {}

      if (
        (!isPublic && !isAuthenticated) ||
        (_.isFunction(isCachedFn) && isCachedFn(state))
      ) {
        return Promise.resolve(true)
      }

      dispatch({
        ...actionProps,
        type: loadingActionType,
      })

      try {
        const { data, headers } = await apiFn(
          _.isFunction(requestData) ? requestData(state) : {}
        )

        // If we need to do some other sort of side effects on success, let's allow that.
        if (_.isFunction(successCb)) {
          successCb(data, {
            dispatch,
          })
        }

        const successActionObj = {
          ...actionProps,
          data,
          type: successActionType,
        }

        // Add the total if in headers.
        if (headers && headers.get('X-Total-Count')) {
          let total = Number.parseInt(headers.get('X-Total-Count'), 10)
          if (Number.isNaN(total)) {
            total = 0
          }

          successActionObj.total = total
        }

        dispatch(successActionObj)

        return data
      } catch (err) {
        error(err)

        if (err.statusCode === STATUS_CODES.UNAUTHORIZED) {
          dispatch({
            type: LOG_OUT,
          })
        } else {
          dispatch({
            ...actionProps,
            error: err.message,
            errorCode: err.statusCode,
            errorData: err.data,
            type: failActionType,
          })
        }

        return err
      }
    }

    return next(action)
  }
}

const apiRequestMiddleware = makeApiRequest()

export default apiRequestMiddleware
