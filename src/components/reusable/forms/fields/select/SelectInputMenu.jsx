import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export const { Consumer, Provider } = React.createContext()

class SelectInputMenu extends Component {
  constructor(props) {
    super(props)

    this.setFocusedOption = this.setFocusedOption.bind(this)
  }

  componentDidUpdate() {
    if (this.menu && this.focusedOption) {
      if (
        this.focusedOption.offsetTop + this.focusedOption.offsetHeight >
        this.menu.offsetHeight + this.menu.scrollTop
      ) {
        this.menu.scrollTop =
          this.focusedOption.offsetTop - this.focusedOption.offsetHeight
      } else if (this.focusedOption.offsetTop < this.menu.scrollTop) {
        this.menu.scrollTop =
          this.focusedOption.offsetTop - this.focusedOption.offsetHeight * 3
      }
    }
  }

  setFocusedOption(ref) {
    this.focusedOption = ref
  }

  render() {
    const { children, isOpen } = this.props

    return (
      <Provider value={this.setFocusedOption}>
        <div
          ref={ref => (this.menu = ref)}
          className={cn('select-input-menu', {
            'select-input-menu-open': isOpen,
          })}
          tabIndex="-1"
        >
          {children}
        </div>
      </Provider>
    )
  }
}

SelectInputMenu.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default SelectInputMenu
