import { formatDate } from '../'

describe('date utils', () => {
  describe('formatDate', () => {
    test('formats number dates properly', () => {
      expect(formatDate(1497449658)).toEqual('06/14/2017')
    })

    test('formats string dates properly', () => {
      expect(formatDate('2017-06-14T16:56:55.455Z')).toEqual('06/14/2017')
    })

    test('allows a specifier for the date format to use for parsing the date value', () => {
      expect(
        formatDate('14:35:32', 'h:mm:ss a', {
          parseFormat: 'hh:mm:ss',
        })
      ).toEqual('2:35:32 pm')
    })
  })
})
