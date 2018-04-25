import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { isApiRequestError } from '../../../utils/api'

class ApiRequest extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      error: {},
      isLoading: props.onMount || false,
    }

    this.makeApiRequest = this.makeApiRequest.bind(this)
  }

  componentDidMount() {
    const { mountRequestProps, onMount } = this.props

    this.mounted = true

    if (onMount) {
      if (mountRequestProps) {
        this.makeApiRequest(...mountRequestProps)
      } else {
        this.makeApiRequest()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { refetchProps } = this.props

    if (!_.isEqual(refetchProps, prevProps.refetchProps)) {
      this.makeApiRequest(...refetchProps)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  /**
   * Makes the API request.
   *
   * @param {Array} requestProps
   * @returns {Promise}
   */
  async makeApiRequest(...requestProps) {
    const { apiFn } = this.props
    let error = {}

    this.setState({
      error: {},
      isLoading: true,
    })

    const apiResult = await apiFn(...requestProps)
    if (isApiRequestError(apiResult)) {
      error = apiResult
    }

    if (this.mounted) {
      this.setState({
        data: isApiRequestError(apiResult) ? null : apiResult,
        error,
        isLoading: false,
      })
    }

    return apiResult
  }

  render() {
    const { children } = this.props
    const { data, error, isLoading } = this.state

    if (!children) {
      return null
    }

    return this.props.children({
      data,
      error,
      isLoading,
      makeApiRequest: this.makeApiRequest,
    })
  }
}

ApiRequest.propTypes = {
  apiFn: PropTypes.func.isRequired,
  children: PropTypes.func,
  mountRequestProps: PropTypes.array,
  onMount: PropTypes.bool,
  refetchProps: PropTypes.array,
}

export default ApiRequest
