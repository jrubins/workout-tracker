import React from 'react'
import PropTypes from 'prop-types'
import { Redirect as ReactRouterRedirect } from 'react-router-dom'

const Redirect = ({ path }) => {
  if (!path) {
    return null
  }

  return <ReactRouterRedirect to={path} />
}

Redirect.propTypes = {
  path: PropTypes.string,
}

export default Redirect
