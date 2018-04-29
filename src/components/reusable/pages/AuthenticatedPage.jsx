import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { isUserAuthenticated } from '../../../reducers'

import BottomNavigation from '../navigation/BottomNavigation'

const AuthenticatedPage = ({ children, isUserAuthenticated }) => {
  if (!isUserAuthenticated) {
    return <Redirect to="/login" />
  }

  return (
    <div className="authenticated-page">
      {children}

      <BottomNavigation />
    </div>
  )
}

AuthenticatedPage.propTypes = {
  isUserAuthenticated: PropTypes.bool.isRequired,

  children: PropTypes.node,
}

export default connect(state => ({
  isUserAuthenticated: isUserAuthenticated(state),
}))(AuthenticatedPage)
