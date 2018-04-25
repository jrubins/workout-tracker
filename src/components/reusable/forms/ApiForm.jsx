import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { isApiRequestError } from '../../../utils/api'

class ApiForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: {},
      isSaving: false,
      successMessage: null,
    }

    this.saveFormRef = this.saveFormRef.bind(this)
    this.submitToApi = this.submitToApi.bind(this)
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  /**
   * Saves a reference to the form for some imperative actions.
   *
   * @param {Object} formRef
   */
  saveFormRef(formRef) {
    this.form = formRef
  }

  /**
   * Submits the form to the API.
   *
   * @param {SyntheticEvent} [event]
   * @param {Object} [opts]
   * @param {Boolean} [opts.validate]
   * @returns {Promise}
   */
  async submitToApi(event = null, { validate = true } = {}) {
    if (event) {
      event.preventDefault()
    }

    const {
      apiFn,
      completedForm,
      initialData,
      resetOnSuccess,
      successMessage,
    } = this.props
    const { isSaving } = this.state

    // Don't allow the form to save if it is already saving.
    if (isSaving) {
      return Promise.reject(new Error('Form is already submitting to API.'))
    }

    const formData = this.form ? this.form.getData({ validate }) : {}
    if (_.isEmpty(formData)) {
      return Promise.reject(
        new Error('Form validation failed or form data to submit is empty.')
      )
    }

    const apiFormData = { ...formData }

    // Add on our initial data ID if it's present.
    if (initialData && !_.isNil(initialData.id)) {
      apiFormData.id = initialData.id
    }

    // Reset our success message if we have one.
    if (successMessage && this.state.successMessage) {
      this.setState({
        successMessage: null,
      })
    }

    this.setState({
      error: {},
      isSaving: true,
    })

    const apiResult = await apiFn(apiFormData)
    if (!isApiRequestError(apiResult)) {
      if (_.isFunction(completedForm)) {
        completedForm(apiResult)
      }

      if (this.form && resetOnSuccess) {
        this.form.reset()
      }

      if (successMessage) {
        this.setState({
          successMessage,
        })
      }
    }

    if (this.mounted) {
      this.setState({
        error: isApiRequestError(apiResult) ? apiResult : {},
        isSaving: false,
      })
    }

    return apiResult
  }

  render() {
    const { children } = this.props
    const { error, isSaving, successMessage } = this.state

    return children({
      error,
      isSaving,
      saveFormRef: this.saveFormRef,
      submitToApi: this.submitToApi,
      successMessage,
    })
  }
}

ApiForm.propTypes = {
  apiFn: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  completedForm: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.number,
  }),
  resetOnSuccess: PropTypes.bool,
}

export default ApiForm
