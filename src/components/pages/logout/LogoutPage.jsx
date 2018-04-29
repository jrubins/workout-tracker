import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { logout } from '../../../actions/users'

import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'

class LogoutPage extends Component {
  componentDidMount() {
    this.props.logout()
  }

  render() {
    return <AuthenticatedPage />
  }
}

LogoutPage.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default connect(null, {
  logout,
})(LogoutPage)
