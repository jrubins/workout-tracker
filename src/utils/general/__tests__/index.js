import { stringToObject } from '../'

describe('general utils', () => {
  describe('stringToObject', () => {
    const defaultOpts = {
      propDelimiter: ':',
      value: 'foo,bar:blah,ket',
      valueDelimiter: ',',
    }

    test('returns an empty object if no value is provided', () => {
      expect(
        stringToObject({
          value: null,
        })
      ).toEqual({})
    })

    test('parses the string into an object with delimiters', () => {
      expect(stringToObject(defaultOpts)).toMatchSnapshot()
    })

    test('allows a value processor to be specified', () => {
      expect(
        stringToObject({
          ...defaultOpts,
          valueProcessorFn: value => value + 1,
        })
      ).toMatchSnapshot()
    })
  })
})
