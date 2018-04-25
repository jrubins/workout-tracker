import {
  getApiSaveData,
  isApiRequestError,
  isApiSaveDataUnchanged,
  makeApiResponseError,
  queryStringify,
  transformFieldsForAPI,
} from '../'

/**
 * Mock application data to be sent to the API.
 *
 * @type {Object}
 */
const mockData = {
  appId1: 'foo',
  appId2: null,
  appId3: 25,
  appId4: [72, 'string'],
  appId5: [],
  appId6: false,
  appId7: '',
  appId8: {},
  appId9: {
    foo: 'bar',
  },
}

describe('api utils', () => {
  describe('getApiSaveData', () => {
    const dataToSave = {
      foo: 'bar',
      id: 5,
    }

    test('returns the passed in resource if it does not have an ID', () => {
      const resource = {
        // This is an object without an ID.
        foo: 'bar',
      }
      expect(
        getApiSaveData({
          data: resource,
        })
      ).toEqual(resource)
    })

    test('returns an empty object if no data has changed', () => {
      expect(
        getApiSaveData({
          data: dataToSave,
          getResourceFn: () => dataToSave,
        })
      ).toEqual({})
    })

    test('returns the changed data fields', () => {
      expect(
        getApiSaveData({
          data: {
            ...dataToSave,
            different: 'newData',
          },
          getResourceFn: () => dataToSave,
        })
      ).toMatchSnapshot()
    })
  })

  describe('isApiRequestError', () => {
    it('returns true if the passed in param is an API request error', () => {
      expect(isApiRequestError(new Error('fail'))).toEqual(true)
    })
  })

  describe('isApiSaveDataUnchanged', () => {
    const dataToSave = {
      foo: 'bar',
      id: 5,
    }

    test('returns false if API data has no ID', () => {
      expect(
        isApiSaveDataUnchanged({
          data: {
            // This is an object without an ID.
            foo: 'bar',
          },
        })
      ).toEqual(false)
    })

    test('returns true if API data is same as existing data', () => {
      expect(
        isApiSaveDataUnchanged({
          data: dataToSave,
          getResourceFn: () => dataToSave,
        })
      ).toEqual(true)
    })

    test('returns false if API data is different than existing data', () => {
      expect(
        isApiSaveDataUnchanged({
          data: {
            ...dataToSave,
            different: 'data',
          },
          getResourceFn: () => dataToSave,
        })
      ).toEqual(false)
    })
  })

  describe('makeApiResponseError', () => {
    test('constructs an Error object with the provided status code and json error', () => {
      const errorStatusCode = 401
      const errorMessage = 'Unauthroized'
      const json = {
        errors: [errorMessage],
      }
      const error = makeApiResponseError({
        json,
        statusCode: errorStatusCode,
      })

      expect(error instanceof Error).toEqual(true)
      expect(error.message).toEqual(errorMessage)
      expect(error.statusCode).toEqual(errorStatusCode)
      expect(error.data).toEqual(json)
    })

    test('constructs a default Error object with the provided status code', () => {
      const errorStatusCode = 500
      const error = makeApiResponseError({
        json: {},
        statusCode: errorStatusCode,
      })

      expect(error instanceof Error).toEqual(true)
      expect(error.message).toEqual('Internal server error')
      expect(error.statusCode).toEqual(errorStatusCode)
    })
  })

  describe('queryStringify', () => {
    test('transforms a provided object into a query string', () => {
      // No query params.
      expect(queryStringify({})).toEqual('')

      // One query param.
      expect(
        queryStringify({
          foo: 'bar',
        })
      ).toMatchSnapshot()

      // Multiple query params.
      expect(
        queryStringify({
          foo: 'bar',
          fox: true,
          objQueryParam: {
            operator: 'gt',
            value: 5,
          },
          numQueryParam: 15,
        })
      ).toMatchSnapshot()
    })

    test('throws an error for an invalid object query param', () => {
      // Test no value for an object query param.
      expect(() => {
        queryStringify({
          badObject: {
            operator: 'lt',
          },
        })
      }).toThrow()

      // Test no operator for an object query param.
      expect(() => {
        queryStringify({
          badObject: {
            value: 24,
          },
        })
      }).toThrow()
    })
  })

  describe('transformFieldsForAPI', () => {
    test('transforms all fields without empty fields', () => {
      expect(
        transformFieldsForAPI({
          data: mockData,
        })
      ).toMatchSnapshot()
    })

    test('allows empty fields to be provided', () => {
      expect(
        transformFieldsForAPI({
          data: mockData,
          onlyWithValue: false,
        })
      ).toMatchSnapshot()
    })
  })
})
