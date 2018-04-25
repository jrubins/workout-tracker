import {
  deleteMock,
  getMock,
  patchMock,
  postMock,
} from '../../../utils/tests/apiMock'
import { transformFieldsForAPI } from '../../../utils/api'

import { apiDelete, get, patch, post } from '../'

describe('base api module', () => {
  const path = '/path'

  describe('query string', () => {
    const query = {
      foo: 'bar',
      blah: 'hoo',
    }

    test('API delete appends query string if present', () => {
      deleteMock({
        path,
        query,
      })

      return apiDelete(path, { query })
    })

    test('API get appends query string if present', () => {
      getMock({
        path,
        query,
      })

      return get(path, { query })
    })

    test('API patch appends query string if present', () => {
      patchMock({
        path,
        query,
      })

      return patch(path, { query })
    })

    test('API post appends query string if present', () => {
      postMock({
        path,
        query,
      })

      return post(path, { query })
    })
  })

  describe('request body', () => {
    const data = {
      companyId: 5,
      emptyField: null,
      name: 'name',
    }

    test('API post transforms the provided request body', () => {
      postMock({
        body: transformFieldsForAPI({ data }),
        path,
      })

      return post(path, {
        body: data,
      })
    })

    test('API post transforms the provided request body with options', () => {
      postMock({
        body: transformFieldsForAPI({
          data,
          onlyWithValue: false,
        }),
        path,
      })

      return post(path, {
        body: data,
        bodyOpts: {
          onlyWithValue: false,
        },
      })
    })

    test('API patch transforms the provided request body with options', () => {
      patchMock({
        body: transformFieldsForAPI({
          data,
          onlyWithValue: false,
        }),
        path,
      })

      return patch(path, {
        body: data,
      })
    })
  })

  describe('headers', () => {
    test('adds an authorization header if an authToken is provided', async () => {
      const authToken = 'alfksdjlfkjladkfwioejkl'
      getMock({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        path,
      })

      await get(path, {
        authToken,
      })
    })

    test('allows custom headers', async () => {
      getMock({
        headers: {
          'X-Customer-Header': 'blah',
        },
        path,
      })

      await get(path, {
        headers: {
          'X-Customer-Header': 'blah',
        },
      })
    })
  })

  describe('versioning', () => {
    test('allows a different version to be specified', async () => {
      getMock({
        path,
        version: 'vFake',
      })

      await get(path, {
        version: '/vFake',
      })
    })
  })

  describe('API requesting', () => {
    test('on success returns an object with data and a status code', async () => {
      expect.assertions(2)

      const apiResultData = {
        foo: 'bar',
      }
      getMock({
        apiResultData,
        path,
      })

      const getResult = await get(path)
      expect(getResult.data).toEqual(apiResultData)
      expect(getResult.status).toEqual(200)
    })

    test('on error throws an Error', async () => {
      expect.assertions(4)

      const apiResultData = {
        message: 'There was an error with your request.',
      }
      const apiResponseCode = 422
      getMock({
        apiResponseCode,
        apiResultData,
        isSuccess: false,
        path,
      })

      let error
      try {
        await get(path)
      } catch (e) {
        error = e
      }

      expect(error).not.toBeUndefined()
      expect(error.data).toEqual(apiResultData)
      expect(error.statusCode).toEqual(apiResponseCode)
      expect(error instanceof Error).toEqual(true)
    })

    describe('does not make the same API request if one is pending', () => {
      test('considers request path', async () => {
        expect.assertions(6)

        const apiResultData = {
          foo: 'silly',
        }
        const expectedApiResult = {
          data: apiResultData,
          status: 200,
        }
        const mock = getMock({
          apiResultData,
          path,
        })

        // The second GET here would fail if we were making two requests since we only
        // set up one mock above.
        const getRequest1 = get(path)
        const getRequest2 = get(path)

        const apiResult1 = await getRequest1
        const apiResult2 = await getRequest2

        // If the mock is not called, this throws an AssertionError.
        mock.done()

        expect(getRequest1 instanceof Promise).toEqual(true)
        expect(getRequest2 instanceof Promise).toEqual(true)
        expect(apiResult1.data).toEqual(expectedApiResult.data)
        expect(apiResult1.status).toEqual(expectedApiResult.status)
        expect(apiResult2.data).toEqual(apiResult1.data)
        expect(apiResult2.status).toEqual(apiResult1.status)
      })

      test('different query strings has two requests', async () => {
        expect.assertions(1)

        const query1 = {
          foo: 'bar',
        }
        const query2 = {
          bar: 'foo',
        }
        const mock1 = getMock({
          path,
          query: query1,
        })
        const mock2 = getMock({
          path,
          query: query2,
        })

        const request1 = get(path, {
          query: query1,
        })
        const request2 = get(path, {
          query: query2,
        })

        await request1
        await request2

        // Throws an assertion error if the mocks weren't called.
        mock1.done()
        mock2.done()

        // Make sure the second request was actually called.
        expect(mock2.pendingMocks().length).toEqual(0)
      })

      test('different bodies makes two requests', async () => {
        expect.assertions(1)

        const body1 = {
          foo: 'bar',
        }
        const body2 = {
          bar: 'foo',
        }
        const mock1 = postMock({
          body: body1,
          path,
        })
        const mock2 = postMock({
          body: body2,
          path,
        })

        const request1 = post(path, {
          body: body1,
        })
        const request2 = post(path, {
          body: body2,
        })

        await request1
        await request2

        // Throws an assertion error if the mocks weren't called.
        mock1.done()
        mock2.done()

        // Make sure the second request was actually called.
        expect(mock2.pendingMocks().length).toEqual(0)
      })
    })

    test('allows a second same request in a different cycle', async () => {
      expect.assertions(2)

      const apiResultData1 = {
        foo: 'silly',
      }
      const apiResultData2 = {
        foo: 'WHAT???',
      }

      getMock({
        apiResultData: apiResultData1,
        path,
      })
      const apiResult1 = await get(path)
      expect(apiResult1.data).toEqual(apiResultData1)

      getMock({
        apiResultData: apiResultData2,
        path,
      })
      const apiResult2 = await get(path)
      expect(apiResult2.data).toEqual(apiResultData2)
    })
  })

  describe('response parsing', () => {
    test('throws error when expecting JSON and receiving something else', async () => {
      expect.assertions(4)

      getMock({
        // This is text that is not parseable JSON so this will be an error.
        apiResultData: 'Not parseable JSON.',
        path,
      })

      let error
      try {
        await get(path)
      } catch (e) {
        error = e
      }

      expect(error).not.toBeUndefined()
      expect(error.data).toBeDefined()
      expect(error.statusCode).toEqual(200)
      expect(error instanceof Error).toEqual(true)
    })

    test('allows custom response parser', async () => {
      expect.assertions(1)

      const apiResultData = 'This is some text that is expected.'
      getMock({
        apiResultData,
        path,
      })

      const apiResult = await get(path, {
        responseParser: () => apiResultData,
        skipDefaultHeaders: true,
      })

      expect(apiResult.data).toEqual(apiResultData)
    })
  })
})
