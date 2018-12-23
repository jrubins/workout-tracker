import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ApiRequest from '@jrubins/react-components/lib/api/ApiRequest'

import { fetchExerciseTypes } from '../../../../../utils/api/exerciseTypes'

import { UserContext } from '../../../../contexts'
import SelectInput from '../../fields/select/SelectInput'
import SelectInputMenu from '../../fields/select/SelectInputMenu'
import SelectInputMenuOption from '../../fields/select/SelectInputMenuOption'

const ExerciseTypeSelect = ({ handleChange, value }) => {
  const [filterText, setFilterText] = useState(null)
  const selectInput = useRef(null)

  /**
   * Handles selection of a new value.
   *
   * @param {Object} option
   */
  function internalHandleChange(option) {
    if (selectInput.current) {
      selectInput.current.blur()
    }

    setFilterText(null)
    handleChange(option)
  }

  return (
    <UserContext.Consumer>
      {({ jwt }) => (
        <ApiRequest apiFn={() => fetchExerciseTypes({ jwt })} onMount={true}>
          {({ data }) => {
            const exerciseTypes = _.get(data, 'data', [])
            let filteredExerciseTypes = _.sortBy(exerciseTypes, 'name')
            if (filterText) {
              filteredExerciseTypes = _.filter(
                filteredExerciseTypes,
                ({ name }) =>
                  name.toLowerCase().startsWith(filterText.toLowerCase())
              )
            }

            return (
              <SelectInput
                ref={selectInput}
                filterText={
                  filterText ||
                  (value
                    ? `${value.name}${
                        value.variation ? ` - ${value.variation}` : ''
                      }`
                    : null)
                }
                handleChange={setFilterText}
                handleEnter={focusedOptionIndex =>
                  internalHandleChange(
                    filteredExerciseTypes[focusedOptionIndex]
                  )
                }
                initialFocusedOptionIndex={
                  value
                    ? _.findIndex(
                        filteredExerciseTypes,
                        ({ name }) => name === value.name
                      )
                    : 0
                }
                numOptions={filteredExerciseTypes.length}
              >
                {({ focusedOptionIndex, isOpen }) => (
                  <SelectInputMenu isOpen={isOpen}>
                    <div className="exercise-type-select-options">
                      {filteredExerciseTypes.length === 0 && (
                        <p className="exercise-type-select-options-none">
                          No exercises found.
                        </p>
                      )}
                      {filteredExerciseTypes.map(({ name, variation }, i) => (
                        <SelectInputMenuOption
                          key={i}
                          handleClick={() =>
                            internalHandleChange(filteredExerciseTypes[i])
                          }
                          isFocused={focusedOptionIndex === i}
                        >
                          <div>{name}</div>
                          <div className="exercise-type-select-option-variation">
                            {variation}
                          </div>
                        </SelectInputMenuOption>
                      ))}
                    </div>
                  </SelectInputMenu>
                )}
              </SelectInput>
            )
          }}
        </ApiRequest>
      )}
    </UserContext.Consumer>
  )
}

ExerciseTypeSelect.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.object,
}

export default ExerciseTypeSelect
