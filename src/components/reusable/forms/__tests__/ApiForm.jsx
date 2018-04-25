import React from 'react'
import { shallow } from 'enzyme'

import { isApiRequestError, makeApiResponseError } from '../../../../utils/api'

import ApiForm from '../ApiForm'

describe.skip('ApiForm Component', () => {
  // This is the mock response data from the API on a submit.
  const apiData = {
    foo: 'bar',
  }
  // This is the mock data that exists in the form that we're submitting.
  const formData = {
    field: 'value',
  }
  const apiFn = jest.fn(() => {
    hasSubmitted = true

    return Promise.resolve(apiData)
  })
  const apiResponseError = makeApiResponseError({
    json: {},
    statusCode: 500,
  })
  const resetFormFn = jest.fn()
  let hasSubmitted = false

  /**
   * Shallow renders the api form.
   *
   * @param {Object} [opts]
   * @param {Object} [opts.apiFormProps]
   * @returns {ShallowWrapper}
   */
  function shallowRenderApiForm({ apiFormProps = {} } = {}) {
    return shallow(
      <ApiForm
        /* eslint-disable no-empty-function */
        children={() => {}}
        apiFn={() => {}}
        /* eslint-enable no-empty-function */
        {...apiFormProps}
      />
    )
  }

  /**
   * Runs through a successful API submit.
   *
   * @param {Object} opts
   * @param {Object} opts.apiFormProps
   * @param {Boolean} [opts.isSuccess]
   * @returns {Promise}
   */
  async function doSubmit({ apiFormProps, isSuccess = true }) {
    hasSubmitted = false
    const apiForm = shallowRenderApiForm({
      apiFormProps: {
        apiFn: isSuccess
          ? apiFn
          : () => {
              hasSubmitted = true

              return Promise.resolve(apiResponseError)
            },
        ...apiFormProps,
      },
    }).instance()

    apiForm.form = {
      getData: () => formData,
      reset: resetFormFn,
    }

    return await apiForm.submitToApi()
  }

  test('rejects a submit if it is already saving', () => {
    expect.assertions(2)

    const apiForm = shallowRenderApiForm({
      apiFormProps: {
        apiFn: () =>
          new Promise(resolve => {
            // This is inside the first save request, where we kick off another save request and confirm it fails.
            apiForm
              .submitToApi()
              .catch(err => {
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toEqual(
                  'Form is already submitting to API.'
                )
              })
              .then(resolve)
          }),
      },
    }).instance()

    apiForm.form = {
      getData: () => formData,
    }

    // This will kick off the first API save request.
    return apiForm.submitToApi()
  })

  test('rejects a submit if the form data is empty', () => {
    expect.assertions(2)

    const apiForm = shallowRenderApiForm().instance()

    // This call to submit API will return empty form data.
    return apiForm.submitToApi().catch(err => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toEqual(
        'Form validation failed or form data to submit is empty.'
      )
    })
  })

  test('passes loading and error state on successful save', async () => {
    expect.assertions(2)

    return await doSubmit({
      apiFormProps: {
        children: ({ error, isSaving }) => {
          if (hasSubmitted) {
            expect(error).toEqual({})
            expect(isSaving).toEqual(false)
          }
        },
      },
    })
  })

  test('passes loading and error state on failed save', async () => {
    expect.assertions(2)

    return await doSubmit({
      apiFormProps: {
        children: ({ error, isSaving }) => {
          if (hasSubmitted) {
            expect(error).toEqual(apiResponseError)
            expect(isSaving).toEqual(false)
          }
        },
      },
      isSuccess: false,
    })
  })

  test('invokes a completedForm function on success', async () => {
    expect.assertions(1)

    const completedForm = jest.fn()
    const apiResponseData = await doSubmit({
      apiFormProps: {
        completedForm,
      },
    })

    expect(completedForm).toBeCalledWith(apiData)

    return apiResponseData
  })

  test('resets the form instance on success', async () => {
    expect.assertions(1)

    const apiResponseData = await doSubmit({
      apiFormProps: {
        resetOnSuccess: true,
      },
    })

    expect(resetFormFn).toBeCalled()

    return apiResponseData
  })

  test('applies the initial data ID if provided', async () => {
    expect.assertions(1)

    const id = 23892389
    const apiResponseData = await doSubmit({
      apiFormProps: {
        initialData: {
          id,
        },
      },
    })

    expect(apiFn).toBeCalledWith({
      ...formData,
      id,
    })

    return apiResponseData
  })

  test('does not call completedForm or form reset on failure', async () => {
    expect.assertions(3)

    const completedForm = jest.fn()
    const apiResponseResult = await doSubmit({
      apiFormProps: {
        completedForm,
        resetOnSuccess: true,
      },
      isSuccess: false,
    })

    expect(isApiRequestError(apiResponseResult)).toEqual(true)
    expect(completedForm).not.toBeCalled()
    expect(resetFormFn).not.toBeCalled()

    return apiResponseResult
  })

  test('sets a success message on success', async () => {
    expect.hasAssertions()

    const expectedSuccessMessage = 'this is much success'
    const apiResponseData = await doSubmit({
      apiFormProps: {
        children: ({ successMessage }) => {
          if (hasSubmitted) {
            expect(successMessage).toEqual(expectedSuccessMessage)
          } else {
            expect(successMessage).toEqual(null)
          }
        },
        successMessage: expectedSuccessMessage,
      },
    })

    return apiResponseData
  })
})
