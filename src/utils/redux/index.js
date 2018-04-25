import _ from 'lodash'

/**
 * Creates a reducer for storing data.
 *
 * @param {Object} opts
 * @param {Object} [opts.additionalHandlers]
 * @param {Array} [opts.clearActionTypes]
 * @param {Function} [opts.dataTransformerFn]
 * @param {Array} [opts.deleteActionTypes]
 * @param {Object} [opts.saveActionTypes]
 * @param {String} [opts.uniqueByKey]
 * @returns {Function}
 */
export function createDataReducer({
  additionalHandlers = {},
  clearActionTypes = [],
  dataTransformerFn = null,
  deleteActionTypes = [],
  saveActionTypes = {},
  uniqueByKey = 'id',
}) {
  return (state = [], action) => {
    const saveActionTypeKey = saveActionTypes[action.type]
    if (!_.isUndefined(saveActionTypeKey)) {
      // Allow just "data" to contain the data we want.
      let data = _.isFunction(saveActionTypeKey)
        ? saveActionTypeKey(action.data)
        : _.get(
            action,
            `data${saveActionTypeKey ? `.${saveActionTypeKey}` : ''}`
          )

      // Make sure we have an array for our data and no "[null]" or "[undefined]" arrays.
      if (!_.isArray(data)) {
        data = data ? [data] : []
      }

      if (_.isFunction(dataTransformerFn)) {
        data = dataTransformerFn(data, action)
      }

      // The below order is important since we want new data to take precedence over old data.
      return _.uniqBy([...data, ...state], uniqueByKey)
    } else if (_.includes(deleteActionTypes, action.type)) {
      return _.reject(state, { id: action.id })
    } else if (_.includes(clearActionTypes, action.type)) {
      return []
    } else if (!_.isEmpty(additionalHandlers)) {
      const actionHandler = additionalHandlers[action.type]
      if (actionHandler) {
        return actionHandler(state, action)
      }
    }

    return state
  }
}
