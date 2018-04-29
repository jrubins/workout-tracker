import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { isUserAuthenticated } from '../../../reducers'

import Redirect from '../navigation/Redirect'

const UnauthenticatedPage = ({ children, isUserAuthenticated }) => {
  if (isUserAuthenticated) {
    return <Redirect path={'/exercises'} />
  }

  return <div className="unauthenticated-page">{children}</div>
}

UnauthenticatedPage.propTypes = {
  isUserAuthenticated: PropTypes.bool.isRequired,

  children: PropTypes.node.isRequired,
}

export default connect(state => ({
  isUserAuthenticated: isUserAuthenticated(state),
}))(UnauthenticatedPage)
