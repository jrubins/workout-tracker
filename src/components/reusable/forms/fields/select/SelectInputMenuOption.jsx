import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Consumer } from './SelectInputMenu'

class SelectInputMenuOption extends Component {
  componentDidMount() {
    this.setFocusedOption()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused) {
      this.setFocusedOption()
    }
  }

  /**
   * Invokes the callback for setting this option as focused if it is.
   */
  setFocusedOption() {
    const { isFocused, setFocusedOption } = this.props

    if (isFocused && this.option) {
      setFocusedOption(this.option)
    }
  }

  render() {
    const { children, handleClick, isFocused } = this.props

    return (
      <div
        ref={ref => (this.option = ref)}
        className={cn('select-input-menu-option', {
          'select-input-menu-option-focused': isFocused,
        })}
        onClick={handleClick}
        onMouseDown={event => event.preventDefault()}
      >
        {children}
      </div>
    )
  }
}

SelectInputMenuOption.propTypes = {
  setFocusedOption: PropTypes.func.isRequired,

  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
}

export default props => (
  <Consumer>
    {setFocusedOption => (
      <SelectInputMenuOption {...props} setFocusedOption={setFocusedOption} />
    )}
  </Consumer>
)
