import { useEffect, useState } from 'react'
import _ from 'lodash'

import { addToDate, getStartOfToday, getTimestamp } from '../../utils/dates'

export function useApiRequest({ apiFn, onMount }, refetchArr = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState({})
  const [isLoading, setIsLoading] = useState(onMount || false)

  async function makeApiRequest(...requestProps) {
    let apiError = {}
    let apiResult

    setError({})
    setIsLoading(true)

    try {
      apiResult = await apiFn(...requestProps)
    } catch (err) {
      apiError = err
    }

    setData(_.isEmpty(apiError) ? apiResult : apiError)
    setError(apiError)
    setIsLoading(false)

    return apiResult
  }

  useEffect(
    () => {
      if (onMount) {
        makeApiRequest()
      }
    },
    [onMount, ...refetchArr]
  )

  return { data, error, isLoading, makeApiRequest }
}

export function useDatePicker() {
  // Start with the current date as our selected date.
  const [selectedDate, setSelectedDate] = useState(getStartOfToday())

  /**
   * Changes the currently selected date either one forwards or one backwards.
   *
   * @param {String} direction
   */
  function changeSelectedDate(direction) {
    let newDate
    if (direction === 'prev') {
      newDate = getTimestamp(
        addToDate(selectedDate, {
          duration: -1,
          unit: 'd',
        })
      )
    } else if (direction === 'next') {
      newDate = getTimestamp(
        addToDate(selectedDate, {
          duration: 1,
          unit: 'd',
        })
      )
    } else if (direction === 'today') {
      newDate = getStartOfToday()
    }

    setSelectedDate(newDate)
  }

  return [selectedDate, changeSelectedDate]
}
