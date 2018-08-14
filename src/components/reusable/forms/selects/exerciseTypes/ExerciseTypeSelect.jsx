import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fetchExerciseTypes } from '../../../../../services/api/exerciseTypes'

import { getUserJwt } from '../../../../../reducers'

import ApiRequest from '../../../api/ApiRequest'
import SelectInput from '../../fields/select/SelectInput'
import SelectInputMenu from '../../fields/select/SelectInputMenu'
import SelectInputMenuOption from '../../fields/select/SelectInputMenuOption'

class ExerciseTypeSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterText: null,
    }

    this.changeFilterText = this.changeFilterText.bind(this)
  }

  /**
   * Changes the current filter text.
   *
   * @param {String} filterText
   */
  changeFilterText(filterText) {
    this.setState({
      filterText,
    })
  }

  /**
   * Handles selection of a new value.
   *
   * @param {Object} option
   */
  handleChange(option) {
    const { handleChange } = this.props

    if (this.selectInput) {
      this.selectInput.blur()
    }

    this.setState(
      {
        filterText: null,
      },
      () => {
        handleChange(option)
      }
    )
  }

  render() {
    const { jwt, value } = this.props
    const { filterText } = this.state

    return (
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
              filterText={
                filterText ||
                (value
                  ? `${value.name}${
                      value.variation ? ` - ${value.variation}` : ''
                    }`
                  : null)
              }
              handleChange={this.changeFilterText}
              handleEnter={focusedOptionIndex =>
                this.handleChange(filteredExerciseTypes[focusedOptionIndex])
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
              setSelectInputRef={ref => (this.selectInput = ref)}
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
                          this.handleChange(filteredExerciseTypes[i])
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
    )
  }
}

ExerciseTypeSelect.propTypes = {
  jwt: PropTypes.string.isRequired,

  handleChange: PropTypes.func.isRequired,
  value: PropTypes.object,
}

export default connect(state => ({
  jwt: getUserJwt(state),
}))(ExerciseTypeSelect)
