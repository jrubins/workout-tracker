import { STATUS_CODES } from '../../../utils/api'

import { LOG_OUT } from '../../../actions'

import makeApiRequest from '../makeApiRequest'

describe.skip('redux middleware', () => {
  describe('makeApiRequest', () => {
    const jwt = 'ffiklwjer092j3fi2e'
    const mockState = {
      customState: 5,
      isCached: true,
      user: {
        isAuthenticated: true,
        jwt,
      },
    }
    const dispatch = jest.fn()
    const getState = jest.fn(() => mockState)
    const nextMiddleware = jest.fn()
    const middlewareFn = makeApiRequest({
      dispatch,
      getState,
    })(nextMiddleware)
    const actionTypes = ['load', 'success', 'fail']

    test('does not consume actions without actionTypes array', () => {
      expect.assertions(1)

      const action = {
        foo: 'bar',
      }
      middlewareFn(action)

      expect(nextMiddleware).toBeCalledWith(action)
    })

    test('allows for prerequest actions', async () => {
      expect.assertions(2)

      const testAction = {
        type: 'test action',
      }
      await middlewareFn({
        actionTypes,
        apiFn: jest.fn(() => Promise.resolve({})),
        preRequestActions: (dispatch, state) => {
          expect(state).toEqual(mockState)
          dispatch(testAction)
        },
      })

      expect(dispatch).toBeCalledWith(testAction)
    })

    test('does not make API request for non-public without JWT', async () => {
      expect.assertions(3)

      const apiFn = jest.fn()
      getState
        // Need two here since the module calls getState twice.
        .mockImplementationOnce(() => ({}))
        .mockImplementationOnce(() => ({
          user: {},
        }))
      const apiResult = await middlewareFn({
        actionTypes,
        apiFn,
      })

      expect(dispatch).not.toBeCalled()
      expect(apiFn).not.toBeCalled()
      expect(apiResult).toEqual(true)
    })

    test('does not make API request if cached function says it is cached', async () => {
      expect.assertions(3)

      const apiFn = jest.fn()
      const apiResult = await middlewareFn({
        actionTypes,
        apiFn,
        isCachedFn: state => state.isCached,
      })

      expect(dispatch).not.toBeCalled()
      expect(apiFn).not.toBeCalled()
      expect(apiResult).toEqual(true)
    })

    test('successfully dispatches an API action', async () => {
      expect.assertions(3)

      const apiData = {
        foo: 'bar',
        jon: 'rubins',
      }
      const apiResult = await middlewareFn({
        actionTypes,
        apiFn: () =>
          Promise.resolve({
            data: apiData,
          }),
      })

      expect(dispatch).toBeCalledWith({
        type: 'load',
      })
      expect(dispatch).toBeCalledWith({
        data: apiData,
        type: 'success',
      })
      expect(apiResult).toEqual(apiData)
    })

    test('passes custom action props to success dispatches', async () => {
      expect.assertions(2)

      await middlewareFn({
        actionPropsFn: state => ({
          foo: 'bar',
          bar: state.customState,
        }),
        actionTypes,
        apiFn: () =>
          Promise.resolve({
            data: {},
          }),
      })
      const expectedActionProps = {
        foo: 'bar',
        bar: mockState.customState,
      }

      expect(dispatch).toBeCalledWith({
        ...expectedActionProps,
        type: 'load',
      })
      expect(dispatch).toBeCalledWith({
        ...expectedActionProps,
        data: {},
        type: 'success',
      })
    })

    test('passes the total to success dispatches', async () => {
      expect.assertions(1)

      const total = '35'
      await middlewareFn({
        actionTypes,
        apiFn: () =>
          Promise.resolve({
            data: {},
            headers: {
              get: header => (header === 'X-Total-Count' ? total : null),
            },
          }),
      })

      expect(dispatch.mock.calls[1][0].total).toEqual(
        Number.parseInt(total, 10)
      )
    })

    test('passes zero as the total to success dispatches if the supplied total is not a number', async () => {
      expect.assertions(1)

      await middlewareFn({
        actionTypes,
        apiFn: () =>
          Promise.resolve({
            data: {},
            headers: {
              get: header => (header === 'X-Total-Count' ? 'asdf' : null),
            },
          }),
      })

      expect(dispatch.mock.calls[1][0].total).toEqual(0)
    })

    test('passes custom requestData and the user JWT to the API function', async () => {
      expect.assertions(1)

      const apiFn = jest.fn(() => Promise.resolve({}))
      await middlewareFn({
        actionTypes,
        apiFn,
        requestData: state => ({
          foo: 'bar',
          bar: state.customState,
        }),
      })

      expect(apiFn).toBeCalledWith({
        foo: 'bar',
        bar: mockState.customState,
        jwt,
      })
    })

    test('invokes an optional callback on success', async () => {
      expect.assertions(1)

      const apiData = {
        foo: 'bar',
        jon: 'rubins',
      }
      const successCb = jest.fn()
      await middlewareFn({
        actionTypes,
        apiFn: () =>
          Promise.resolve({
            data: apiData,
          }),
        successCb,
      })

      expect(successCb).toBeCalledWith(apiData, {
        dispatch,
      })
    })

    test('dispatches a failed API action', async () => {
      expect.assertions(3)

      const errorMessage = 'Failed API request'
      const errorCode = 500
      const errorData = {
        foo: 'bar',
      }
      const error = new Error(errorMessage)
      error.statusCode = errorCode
      error.data = errorData
      const apiResult = await middlewareFn({
        actionTypes,
        apiFn: () => Promise.reject(error),
      })

      expect(dispatch).toBeCalledWith({
        type: 'load',
      })
      expect(dispatch).toBeCalledWith({
        error: errorMessage,
        errorCode,
        errorData,
        type: 'fail',
      })
      expect(apiResult).toEqual(error)
    })

    test('passes custom action props to fail dispatches', async () => {
      expect.assertions(1)

      await middlewareFn({
        actionPropsFn: state => ({
          foo: 'bar',
          bar: state.customState,
        }),
        actionTypes,
        apiFn: () => Promise.reject(new Error('Fail')),
      })
      const expectedActionProps = {
        foo: 'bar',
        bar: mockState.customState,
      }

      expect(dispatch).toBeCalledWith({
        ...expectedActionProps,
        error: 'Fail',
        errorCode: undefined,
        errorData: undefined,
        type: 'fail',
      })
    })

    test.skip('dispatches a logout action if the API returns a 401', async () => {
      expect.assertions(1)

      const errorCode = STATUS_CODES.UNAUTHORIZED
      const error = new Error('Unauthorized')
      error.statusCode = errorCode
      await middlewareFn({
        actionTypes,
        apiFn: () => Promise.reject(error),
      })

      expect(dispatch).toBeCalledWith({
        type: LOG_OUT,
      })
    })
  })
})
