import { createDataReducer } from '../'

describe('redux tests', () => {
  describe('createDataReducer', () => {
    const types = {
      fetch: 'fetch',
      fetchFn: 'fetchFn',
      fetchWithoutWrapper: 'fetchWithoutWrapper',
    }
    const saveActionTypes = {
      [types.fetch]: 'things',
      [types.fetchWithoutWrapper]: '',
      [types.fetchFn]: data => data.map(({ nestedThing }) => nestedThing),
    }
    const dataPoint = {
      foo: 'bar',
      id: 1,
    }

    const dataReducer = createDataReducer({
      saveActionTypes,
    })

    test('returns data on successfully fetch', () => {
      expect(
        dataReducer([], {
          data: {
            [saveActionTypes[types.fetch]]: [dataPoint],
          },
          type: types.fetch,
        })
      ).toMatchSnapshot()
    })

    test('returns data on successfully fetchWithoutWrapper', () => {
      expect(
        dataReducer([], {
          data: [dataPoint],
          type: types.fetchWithoutWrapper,
        })
      ).toMatchSnapshot()
    })

    test('uniquely saves data by ID', () => {
      expect(
        dataReducer([], {
          data: {
            [saveActionTypes[types.fetch]]: [dataPoint, dataPoint],
          },
          type: types.fetch,
        })
      ).toMatchSnapshot()
    })

    test('prefers newer data over old data', () => {
      expect(
        dataReducer([], {
          data: {
            [saveActionTypes[types.fetch]]: [
              {
                ...dataPoint,
                newDataPoint: 'newData',
              },
              dataPoint,
            ],
          },
          type: types.fetch,
        })
      ).toMatchSnapshot()
    })

    test('allows a function to be used in the saveActionTypes keys', () => {
      expect(
        dataReducer([], {
          data: [
            {
              nestedThing: {
                blah: 'kazaam',
                id: 1,
              },
            },
            {
              nestedThing: {
                huey: 'kaphooey',
                id: 2,
              },
            },
          ],
          type: types.fetchFn,
        })
      ).toMatchSnapshot()
    })

    test('allows an optional data transformer to be specified', () => {
      const transformerDataReducer = createDataReducer({
        dataTransformerFn: data =>
          data.map(dataPoint => ({
            ...dataPoint,
            customAttr: 'fakestuff',
          })),
        saveActionTypes,
      })
      expect(
        transformerDataReducer([], {
          data: {
            [saveActionTypes[types.fetch]]: [dataPoint],
          },
          type: types.fetch,
        })
      ).toMatchSnapshot()
    })

    test('deletes data', () => {
      const deleteActionType = 'deleteActionType'
      const deleteDataReducer = createDataReducer({
        deleteActionTypes: [deleteActionType],
      })
      expect(
        deleteDataReducer([dataPoint], {
          id: dataPoint.id,
          type: deleteActionType,
        })
      ).toMatchSnapshot()
    })

    test('clears data', () => {
      const clearActionType = 'clearActionType'
      const clearDataReducer = createDataReducer({
        clearActionTypes: [clearActionType],
      })
      expect(
        clearDataReducer([dataPoint], {
          type: clearActionType,
        })
      ).toMatchSnapshot()
    })
  })
})
