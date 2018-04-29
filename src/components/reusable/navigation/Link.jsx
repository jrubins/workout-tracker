import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const Link = ({ children, exact, handleClick, to }) => (
  <NavLink
    activeClassName="link-active"
    className="link" // eslint-disable-line react/forbid-component-props
    exact={exact}
    onClick={handleClick}
    to={to}
  >
    {children}
  </NavLink>
)

Link.propTypes = {
  children: PropTypes.node.isRequired,
  exact: PropTypes.bool,
  handleClick: PropTypes.func,
  to: PropTypes.string.isRequired,
}

Link.defaultProps = {
  exact: true,
}

export default Link
