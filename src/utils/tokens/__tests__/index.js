import { decodeJwt } from '../'

describe('token utils', () => {
  describe('decodeJwt', () => {
    test('decodes a JWT token', () => {
      const expectedDecodeResult = {
        exp: 1514503546,
        iat: 1514496346,
        user_id: '1', // eslint-disable-line camelcase
      }

      expect(
        decodeJwt(
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MTQ1MDM1NDYsImlhdCI6MTUxNDQ5NjM0NiwidXNlcl9pZCI6IjEifQ.SzrwO1_U94us0LmPSH_pq8YXZscT85pTWJ5qIMdvXQ0'
        )
      ).toEqual(expectedDecodeResult)
    })

    test('does not try to decode a not truthy JWT token', () => {
      expect(decodeJwt('')).toEqual({})
      expect(decodeJwt(null)).toEqual({})
      expect(decodeJwt(NaN)).toEqual({})
      expect(decodeJwt(undefined)).toEqual({})
      expect(decodeJwt(0)).toEqual({})
    })

    test('does not throw an exception with an invalid JWT', () => {
      expect(
        decodeJwt(
          'eyJ0eXAiOiJ.eyJleHAiOjE1MTQ.SzrwO1_U94us0LmPSH_pq8YXZscT85pTWJ'
        )
      ).toEqual({})
    })
  })
})
