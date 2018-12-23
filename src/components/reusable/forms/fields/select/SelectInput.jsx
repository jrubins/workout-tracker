import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { KEYCODES } from '@jrubins/utils/lib/keyboard'
import _ from 'lodash'
import Input from '@jrubins/react-components/lib/forms/fields/Input'

class SelectInput extends Component {
  constructor(props) {
    super(props)

    const focusedOptionIndex =
      props.initialFocusedOptionIndex && props.initialFocusedOptionIndex >= 0
        ? props.initialFocusedOptionIndex
        : 0

    this.state = {
      focusedOptionIndex,
      isOpen: false,
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    if (this.props.autofocus && this.selectInput) {
      this.selectInput.focus()
    }
  }

  componentDidUpdate(prevProps) {
    const { initialFocusedOptionIndex, numOptions } = this.props

    if (
      numOptions > 0 &&
      prevProps.numOptions === 0 &&
      this.state.focusedOptionIndex !== 0
    ) {
      this.setState({
        focusedOptionIndex: 0,
      })
    }

    if (initialFocusedOptionIndex !== prevProps.initialFocusedOptionIndex) {
      this.setState({
        focusedOptionIndex: initialFocusedOptionIndex,
      })
    }
  }

  /**
   * Handles a key down on the select.
   *
   * @param {SyntheticEvent} event
   */
  handleKeyDown(event) {
    const { handleEnter, numOptions } = this.props
    const { focusedOptionIndex } = this.state

    switch (event.keyCode) {
      case KEYCODES.ENTER:
        handleEnter(focusedOptionIndex)
        break

      case KEYCODES.ARROW_UP:
        this.setState(({ focusedOptionIndex }) => ({
          focusedOptionIndex: Math.max(0, focusedOptionIndex - 1),
        }))
        break

      case KEYCODES.ARROW_DOWN:
        this.setState(({ focusedOptionIndex }) => ({
          focusedOptionIndex: Math.min(focusedOptionIndex + 1, numOptions - 1),
        }))
        break

      default:
        return
    }

    event.preventDefault()
  }

  render() {
    const {
      children,
      disabled,
      filterText,
      forwardedRef,
      handleBlur,
      handleChange,
      handleFocus,
      placeholder,
    } = this.props
    const { focusedOptionIndex, isOpen } = this.state

    return (
      <div
        className="select-input"
        onBlur={() => {
          this.setState({
            isOpen: false,
          })

          if (_.isFunction(handleBlur)) {
            handleBlur()
          }
        }}
        onKeyDown={this.handleKeyDown}
      >
        <Input
          ref={forwardedRef}
          disabled={disabled}
          handleChange={handleChange}
          handleFocus={() => {
            this.setState({
              isOpen: true,
            })

            if (_.isFunction(handleFocus)) {
              handleFocus()
            }
          }}
          placeholder={placeholder}
          type="text"
          value={filterText}
        />

        {children({
          focusedOptionIndex,
          isOpen,
        })}
      </div>
    )
  }
}

SelectInput.propTypes = {
  autofocus: PropTypes.bool,
  children: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  filterText: PropTypes.string,
  forwardedRef: PropTypes.any,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
  handleEnter: PropTypes.func.isRequired,
  handleFocus: PropTypes.func,
  initialFocusedOptionIndex: PropTypes.number,
  numOptions: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
}

export default React.forwardRef((props, ref) => (
  <SelectInput {...props} forwardedRef={ref} />
))
