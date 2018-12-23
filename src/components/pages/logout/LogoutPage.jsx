import React, { useContext } from 'react'

import { UserContext } from '../../contexts'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'

const LogoutPage = () => {
  const { setJwt } = useContext(UserContext)
  setJwt(null)

  return <AuthenticatedPage />
}

export default LogoutPage
