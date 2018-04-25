import { unStringifyQuery } from '../'

describe('routes utils', () => {
  describe('unStringifyQuery', () => {
    test('returns an empty object if there is no query string', () => {
      expect(unStringifyQuery(null)).toEqual({})
      expect(unStringifyQuery('?foo=bar&blah=ball')).toMatchSnapshot()
    })
  })
})
