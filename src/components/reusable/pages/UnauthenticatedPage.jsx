import React from 'react'
import PropTypes from 'prop-types'

import { UserContext } from '../../contexts'
import Redirect from '../navigation/Redirect'

const UnauthenticatedPage = ({ children }) => (
  <UserContext.Consumer>
    {({ jwt }) => {
      if (jwt) {
        return <Redirect path="/exercises" />
      }

      return <div className="unauthenticated-page">{children}</div>
    }}
  </UserContext.Consumer>
)

UnauthenticatedPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default UnauthenticatedPage
