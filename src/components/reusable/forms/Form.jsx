import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fields: this.getFormFieldsState({
        defaults: props.defaults,
        fields: _.map(props.formFields, 'fieldName'),
        initialData: props.initialData,
        valuesToSet: props.initialData,
      }),
    }

    // Keep track of fields that have been changed so we can show invalid indicators - don't
    // want to show an invalid indicator to something that hasn't been manipulated yet in
    // the onChange handler.
    this.changedFields = []

    this.handleChange = this.handleChange.bind(this)
    // We throttle our validation to not block if a user is changing a value quickly.
    this.throttledValidateFields = _.throttle(this.validateFields, 200)
  }

  componentWillReceiveProps(nextProps) {
    const { defaults, fieldErrors, formFields, initialData } = this.props
    const {
      defaults: nextDefaults,
      fieldErrors: nextFieldErrors,
      formFields: nextFormFields,
      initialData: nextInitialData,
    } = nextProps
    const { fields } = this.state

    if (!_.isEqual(formFields, nextFormFields)) {
      // We have a new set of fields. Reset to the initial data we were provided and any defaults.
      this.setState({
        fields: this.getFormFieldsState({
          defaults: nextDefaults,
          fields: _.map(nextFormFields, 'fieldName'),
          initialData: nextInitialData,
          valuesToSet: nextInitialData,
        }),
      })
    } else if (!_.isEqual(initialData, nextInitialData)) {
      // We have different initial data. Reset our existing fields using the new initial data.
      this.setState({
        fields: this.getFormFieldsState({
          defaults: nextDefaults,
          fields: _.keys(fields),
          initialData: nextInitialData,
          valuesToSet: nextInitialData,
        }),
      })
      this.changedFields = []
    } else if (!_.isEqual(fieldErrors, nextFieldErrors)) {
      // We have new errors. Update our fields to contain the new error.
      this.setState({
        fields: this.getFormFieldsState({
          defaults: nextDefaults,
          errors: nextFieldErrors,
          fields: _.keys(fields),
          // Make sure the data doesn't reset but is whatever the user has changed.
          valuesToSet: this.getData({
            validate: false,
          }),
        }),
      })
    } else if (!_.isEqual(defaults, nextDefaults)) {
      // We have new defaults. Add defaults to any fields that need it them.
      this.setState({
        fields: this.getFormFieldsState({
          defaults: nextDefaults,
          fields: _.keys(fields),
          initialData: nextInitialData,
          // Make sure the data doesn't reset but is whatever the user has changed.
          valuesToSet: this.getData({
            validate: false,
          }),
        }),
      })
    }
  }

  componentWillUnmount() {
    if (this.throttledValidateFields) {
      this.throttledValidateFields.cancel()
    }
  }

  /**
   * Returns the data from the form state. Optionally validates the form fields.
   *
   * @param {Object} [opts]
   * @param {Boolean} [opts.validate]
   * @returns {Object}
   */
  getData({ validate = true } = {}) {
    const { fields } = this.state
    let validForm = true

    // Check if we have any invalid fields.
    if (validate) {
      validForm = this.validateFields({
        requiresChange: false,
      })
    }

    if (validForm) {
      return _.mapValues(fields, 'value')
    }

    return {}
  }

  /**
   * Returns an object of form field state. Uses the data for initial values if provided.
   *
   * @param {Object} opts
   * @param {Object} [opts.defaults]
   * @param {Object} [opts.errors]
   * @param {Array} opts.fields
   * @param {Object} [opts.initialData]
   * @param {Object} [opts.valuesToSet]
   * @returns {Object}
   */
  getFormFieldsState({
    defaults = {},
    errors = {},
    fields,
    initialData = {},
    valuesToSet = {},
  }) {
    const formFieldsState = {}
    fields.forEach(formField => {
      const fieldError = _.get(errors, formField, null)
      const fieldDefault = _.get(defaults, formField, null)
      const fieldInitialValue = _.get(initialData, formField, null)
      const fieldValueToSet = _.get(valuesToSet, formField, null)

      // Use the default if one exists, the user hasn't yet updated the value of this field and there wasn't
      // initial data provided for the field.
      const useDefault =
        !fieldInitialValue &&
        fieldDefault &&
        !_.includes(this.changedFields, formField)

      formFieldsState[formField] = {
        errorMessage: _.isArray(fieldError)
          ? fieldError.join('; ')
          : fieldError,
        value: useDefault ? fieldDefault : fieldValueToSet,
      }
    })

    return formFieldsState
  }

  /**
   * Handles a change to a form field.
   *
   * @param {String} fieldName
   * @param {String} fieldValue
   */
  handleChange(fieldName, fieldValue) {
    const { onFormFieldChanged, skipChangeValidation } = this.props
    const { fields } = this.state
    const newFields = {
      ...fields,
    }

    newFields[fieldName].value = fieldValue
    this.changedFields = _.uniq([...this.changedFields, fieldName])

    this.setState(
      {
        fields: newFields,
      },
      () => {
        if (!skipChangeValidation) {
          this.throttledValidateFields()
        }

        if (_.isFunction(onFormFieldChanged)) {
          onFormFieldChanged()
        }
      }
    )
  }

  /**
   * Resets the form state - clears it.
   */
  reset() {
    const { defaults, initialData } = this.props
    const { fields } = this.state

    this.setState({
      // When we reset, we use the any initial data that was provided. It's up to the caller
      // to clear the initial data if this isn't what they want.
      fields: this.getFormFieldsState({
        defaults,
        fields: _.keys(fields),
        initialData,
        valuesToSet: initialData,
      }),
    })
    this.changedFields = []
  }

  /**
   * Validates the form fields if they have an invalidFn function in their configuration.
   *
   * @param {Object} [opts]
   * @param {Boolean} [opts.requiresChange]
   * @returns {Boolean}
   */
  validateFields({ requiresChange = true } = {}) {
    const { formFields } = this.props
    const { fields } = this.state
    const newFields = {
      ...fields,
    }
    let formHasInvalidField = false

    // Check if we have any invalid fields. We need to check all fields since some fields may rely
    // on the value of others.
    _.forEach(formFields, ({ fieldName, invalidFn }) => {
      const fieldValue = fields[fieldName].value

      // Only want to validate fields that have been changed.
      if (_.isFunction(invalidFn)) {
        // If we need to be changed and we have't yet, skip this field.
        if (requiresChange && !_.includes(this.changedFields, fieldName)) {
          return
        }

        // Check if our field is valid.
        const errorMessage = invalidFn({
          changedFields: this.changedFields,
          fieldValue,
          fields,
        })

        if (errorMessage) {
          formHasInvalidField = true
          newFields[fieldName].errorMessage = errorMessage
        } else {
          newFields[fieldName].errorMessage = null
        }
      }
    })

    this.setState({
      fields: newFields,
    })

    return !formHasInvalidField
  }

  render() {
    const { children, isNested } = this.props
    const { fields } = this.state
    const FormTag = isNested ? 'div' : 'form'

    return (
      <FormTag
        className="form" // eslint-disable-line react/forbid-component-props
      >
        {children({
          fields,
          handleChange: this.handleChange,
        })}
      </FormTag>
    )
  }
}

Form.propTypes = {
  children: PropTypes.func.isRequired,
  defaults: PropTypes.object,
  fieldErrors: PropTypes.object,
  formFields: PropTypes.objectOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      invalidFn: PropTypes.func,
    })
  ).isRequired,
  initialData: PropTypes.object,
  isNested: PropTypes.bool,
  onFormFieldChanged: PropTypes.func,
  skipChangeValidation: PropTypes.bool,
}

export default Form
