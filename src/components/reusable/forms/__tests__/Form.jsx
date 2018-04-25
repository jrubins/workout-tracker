import React from 'react'
import { shallow } from 'enzyme'
import _ from 'lodash'

import Form from '../Form'

describe('Form Component', () => {
  const FORM_STATE_FIELDS = {
    FORM_FIELD: {
      fieldName: 'foo',
    },
  }
  const initialFormFieldValue = 'initial value'
  const defaultFieldValue = 'default value'
  const initialData = {
    [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: initialFormFieldValue,
  }
  const defaults = {
    [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: defaultFieldValue,
  }

  /**
   * Shallow renders the form.
   *
   * @param {Object} [opts]
   * @param {Object} [opts.formProps]
   * @returns {ShallowWrapper}
   */
  function shallowRenderForm({ formProps = {} } = {}) {
    return shallow(
      <Form
        /* eslint-disable no-empty-function */
        children={() => {}}
        /* eslint-enable no-empty-function */
        formFields={FORM_STATE_FIELDS}
        {...formProps}
      />
    )
  }

  test('passes down fields to the form child function', () => {
    expect.assertions(3)

    shallowRenderForm({
      formProps: {
        children: ({ fields }) => {
          // Make sure the number of fields is the number of fields we configured.
          expect(_.size(fields)).toEqual(_.keys(FORM_STATE_FIELDS).length)

          // Expect that we don't have a value nor an error message for our field.
          expect(
            fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].errorMessage
          ).toEqual(null)
          expect(fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value).toEqual(
            null
          )
        },
      },
    })
  })

  test('updates field state when change occurs', () => {
    expect.assertions(3)

    const newValue = 'user input value'
    let handleChangeFn
    let changed = false

    const form = shallowRenderForm({
      formProps: {
        children: ({ fields, handleChange }) => {
          handleChangeFn = handleChange

          if (changed) {
            expect(
              fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
            ).toEqual(newValue)
          } else {
            expect(
              fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
            ).toEqual(null)
          }
        },
        // Skip change validation so we only get two renders, otherwise we'll get three.
        skipChangeValidation: true,
      },
    })

    // Change the value of our form field.
    changed = true
    handleChangeFn(FORM_STATE_FIELDS.FORM_FIELD.fieldName, newValue)

    expect(form.instance().changedFields).toEqual([
      FORM_STATE_FIELDS.FORM_FIELD.fieldName,
    ])
  })

  test('invokes an optional callback when a field changes', () => {
    expect.hasAssertions()

    const onFormFieldChanged = jest.fn()
    let handleChangeFn

    shallowRenderForm({
      formProps: {
        children: ({ handleChange }) => {
          handleChangeFn = handleChange
        },
        onFormFieldChanged,
      },
    })

    handleChangeFn(
      FORM_STATE_FIELDS.FORM_FIELD.fieldName,
      'not checking this value so it does not matter'
    )

    expect(onFormFieldChanged).toBeCalled()
  })

  test('exposes a reset method', () => {
    expect.hasAssertions()

    const formField1ChangeValue = 'user change form field 1'
    const formField2ChangeValue = 'user change form field 2'
    const formFields = {
      FORM_FIELD_1: {
        fieldName: 'formField1',
      },
      FORM_FIELD_2: {
        fieldName: 'formField2',
      },
    }
    // Set up our initial data so one field has an initial value. When we reset, it should go back to this.
    const initialData = {
      formField1: initialFormFieldValue,
    }
    let hasChanged1 = false
    let hasChanged2 = false
    let handleChangeFn

    const form = shallowRenderForm({
      formProps: {
        children: ({ fields, handleChange }) => {
          handleChangeFn = handleChange

          if (hasChanged1) {
            expect(fields[formFields.FORM_FIELD_1.fieldName].value).toEqual(
              formField1ChangeValue
            )
          } else if (hasChanged2) {
            expect(fields[formFields.FORM_FIELD_2.fieldName].value).toEqual(
              formField2ChangeValue
            )
          } else {
            // Check the initial values or the reset values.
            expect(fields[formFields.FORM_FIELD_1.fieldName].value).toEqual(
              initialFormFieldValue
            )
            expect(fields[formFields.FORM_FIELD_2.fieldName].value).toEqual(
              null
            )
          }
        },
        formFields,
        initialData,
        // Don't want validation re-renders.
        skipChangeValidation: true,
      },
    })

    // Change our form values.
    hasChanged1 = true
    handleChangeFn(formFields.FORM_FIELD_1.fieldName, formField1ChangeValue)
    hasChanged2 = true
    handleChangeFn(formFields.FORM_FIELD_2.fieldName, formField2ChangeValue)

    // Reset our form.
    hasChanged1 = false
    hasChanged2 = false
    form.instance().reset()

    // Expect the form not to have any changed fields.
    expect(form.instance().changedFields).toEqual([])
  })

  test('validates form field values', () => {
    expect.assertions(1)

    const formFields = {
      FORM_FIELD: {
        fieldName: 'foo',
        invalidFn: ({ fieldValue }) => fieldValue !== 10 && validationMessage,
      },
    }
    const validationMessage = 'Please enter 10 for the value.'
    let handleChangeFn
    let changed = false
    let validated = false

    shallowRenderForm({
      formProps: {
        children: ({ fields, handleChange }) => {
          handleChangeFn = handleChange

          // First we'll render for the change that occurs.
          if (changed) {
            changed = false
            validated = true
          } else if (validated) {
            // Then we'll render after validation has occured.
            expect(
              fields[formFields.FORM_FIELD.fieldName].errorMessage
            ).toEqual(validationMessage)
          }
        },
        formFields,
      },
    })

    // Change our form field
    changed = true
    handleChangeFn(formFields.FORM_FIELD.fieldName, 'new value not number')
  })

  test('exposes method to get the form data', () => {
    expect.assertions(1)

    const form = shallowRenderForm({
      formProps: {
        initialData,
      },
    })

    expect(form.instance().getData()).toEqual({
      [FORM_STATE_FIELDS.FORM_FIELD.fieldName]:
        initialData[FORM_STATE_FIELDS.FORM_FIELD.fieldName],
    })
  })

  test('get the form data returns empty object if form fields are invalid', () => {
    expect.assertions(1)

    const form = shallowRenderForm({
      formProps: {
        formFields: {
          FORM_FIELD: {
            fieldName: 'foo',
            invalidFn: ({ fieldValue }) => !fieldValue && true,
          },
        },
      },
    })

    expect(form.instance().getData()).toEqual({})
  })

  describe('initial data tests', () => {
    test('uses the supplied initial data', () => {
      expect.assertions(1)

      shallowRenderForm({
        formProps: {
          children: ({ fields }) => {
            expect(
              fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
            ).toEqual(initialFormFieldValue)
          },
          initialData,
        },
      })
    })

    test('updates initial data if it changes', () => {
      expect.hasAssertions()

      const newInitialValue = 'This is a new initial value for the form field'
      let changedInitial = false

      const form = shallowRenderForm({
        formProps: {
          children: ({ fields }) => {
            if (changedInitial) {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(newInitialValue)
            } else {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(initialFormFieldValue)
            }
          },
          initialData,
        },
      })

      // Change the initial data.
      changedInitial = true
      form.setProps({
        initialData: {
          [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: newInitialValue,
        },
      })
    })
  })

  describe('form errors tests', () => {
    test('uses new form errors for fields', () => {
      expect.assertions(1)

      const errorMessage = 'This is a bad error'

      const wrapper = shallowRenderForm()

      wrapper.setProps({
        children: ({ fields }) => {
          expect(
            fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].errorMessage
          ).toEqual(errorMessage)
        },
        fieldErrors: {
          [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: errorMessage,
        },
      })
    })
  })

  describe('defaults tests', () => {
    test('uses provided defaults', () => {
      expect.hasAssertions()

      const newDefaultValue = 'changed default value'
      let changedDefault = false

      const form = shallowRenderForm({
        formProps: {
          children: ({ fields }) => {
            if (changedDefault) {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(newDefaultValue)
            } else {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(defaultFieldValue)
            }
          },
          defaults,
        },
      })

      // Change the default data.
      changedDefault = true
      form.setProps({
        defaults: {
          [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: newDefaultValue,
        },
      })
    })

    test('does not use default if field has been changed', () => {
      expect.hasAssertions()

      const changedValue = 'user input value'
      const newDefaultValue = 'changed default value'
      let handleChangeFn
      let changed = false
      let changedDefault = false

      const form = shallowRenderForm({
        formProps: {
          children: ({ fields, handleChange }) => {
            handleChangeFn = handleChange

            if (changed || changedDefault) {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(changedValue)
            } else {
              expect(
                fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
              ).toEqual(defaultFieldValue)
            }
          },
          defaults,
        },
      })

      // Change our form field
      changed = true
      handleChangeFn(FORM_STATE_FIELDS.FORM_FIELD.fieldName, changedValue)

      // Change the default data.
      changedDefault = true
      form.setProps({
        defaults: {
          [FORM_STATE_FIELDS.FORM_FIELD.fieldName]: newDefaultValue,
        },
      })
    })

    test('does not use default if the field has initial data provided', () => {
      expect.hasAssertions()

      shallowRenderForm({
        formProps: {
          children: ({ fields }) => {
            expect(
              fields[FORM_STATE_FIELDS.FORM_FIELD.fieldName].value
            ).toEqual(initialFormFieldValue)
          },
          defaults,
          initialData,
        },
      })
    })
  })
})
