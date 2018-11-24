import React from 'react'

import { UserContext } from '../../contexts'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'

const LogoutPage = () => (
  <UserContext.Consumer>
    {({ setJwt }) => {
      setJwt(null)

      return <AuthenticatedPage />
    }}
  </UserContext.Consumer>
)

export default LogoutPage
