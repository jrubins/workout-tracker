import React, { useContext } from 'react'
import _ from 'lodash'

import { analyzeAttendance, analyzeWeight } from '../../../utils/api/analyze'

import { UserContext } from '../../contexts'
import { useApiRequest } from '../../hooks'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'

/**
 * Accepts a numeric value and truncates decimal digits without rounding.
 *
 * @param {Object} opts
 * @param {Number} opts.numDecimals
 * @param {Number} opts.value
 * @returns {String}
 */
function noRound({ numDecimals, value }) {
  if (!value) {
    return ''
  }

  const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${numDecimals}})?`)
  const regexMatch = value.toString().match(regex)
  let transformedValue = value

  if (regexMatch) {
    transformedValue = regexMatch[0]
  }

  return transformedValue
}

const AnalyzePage = () => {
  const { jwt } = useContext(UserContext)
  const { data: attendanceData } = useApiRequest({
    apiFn: () => analyzeAttendance({ jwt }),
    onMount: true,
  })
  const { data: weightData } = useApiRequest({
    apiFn: () => analyzeWeight({ jwt }),
    onMount: true,
  })
  const attendance = _.get(attendanceData, 'data') || 0
  const weight = _.get(weightData, 'data') || 0

  return (
    <AuthenticatedPage>
      <div className="analyze-page page">
        <div className="analyze-days-per-week">
          {noRound({ numDecimals: 2, value: attendance.daysPerWeek })}{' '}
          <span className="analyze-days-per-week-label">days / week</span>
        </div>

        <div className="analyze-weight">
          {noRound({ numDecimals: 1, value: weight.average })}{' '}
          <span className="analyze-weight-label">lbs</span>
        </div>
      </div>
    </AuthenticatedPage>
  )
}

AnalyzePage.propTypes = {}

export default AnalyzePage
