import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'

import { UserContext } from '../../contexts'
import BottomNavigation from '../navigation/BottomNavigation'

const AuthenticatedPage = ({ children }) => {
  return (
    <UserContext.Consumer>
      {({ jwt }) => {
        if (jwt) {
          return (
            <div className="authenticated-page">
              {children}

              <BottomNavigation />
            </div>
          )
        }

        return <Redirect to="/login" />
      }}
    </UserContext.Consumer>
  )
}

AuthenticatedPage.propTypes = {
  children: PropTypes.node,
}

export default AuthenticatedPage
