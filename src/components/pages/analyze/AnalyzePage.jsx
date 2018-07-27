import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  addToDate,
  formatDate,
  getTimestamp,
  relativeDate,
  startOfDay,
} from '../../../utils/dates'
import { getTimeDisplay } from '../../../utils/exercises'

import { getExercises, getWeight } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'
import { fetchWeight } from '../../../actions/weight'

import ApiRequest from '../../reusable/api/ApiRequest'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import ExerciseNameSelect from '../../reusable/forms/selects/ExerciseNameSelect'
import FormGroup from '../../reusable/forms/FormGroup'

class AnalyzePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      analyzeWeight: false,
      selectedExercise: null,
    }

    this.analyzeWeight = this.analyzeWeight.bind(this)
    this.selectExercise = this.selectExercise.bind(this)
  }

  /**
   * Sets analysis to weight mode.
   */
  analyzeWeight() {
    this.setState({
      analyzeWeight: true,
      selectedExercise: null,
    })
  }

  /**
   * Selects an exercise to analyze.
   *
   * @param {String} selectedExercise
   */
  selectExercise(selectedExercise) {
    this.setState({
      analyzeWeight: false,
      selectedExercise,
    })
  }

  render() {
    const { exercises, fetchExercises, fetchWeight, weight } = this.props
    const { analyzeWeight, selectedExercise } = this.state
    const exercisesToAnalyze = _.orderBy(
      _.filter(
        exercises,
        ({ name, sets }) => name === selectedExercise && sets.length > 0
      ),
      'date'
    )
    const isDistanceExercise =
      _.get(exercisesToAnalyze[0], 'type') === 'Distance'
    const isRepsExercise = _.get(exercisesToAnalyze[0], 'type') === 'Reps'
    const isTimeExercise = _.get(exercisesToAnalyze[0], 'type') === 'Time'
    let chartData

    if (analyzeWeight) {
      chartData = _.orderBy(weight, 'date')
    } else {
      chartData = _.map(exercisesToAnalyze, ({ date, sets, type }) => {
        if (type === 'Distance') {
          return {
            date,
            distance: sets[0].distance,
            time: sets[0].time,
            type,
          }
        } else if (type === 'Weight') {
          return {
            date,
            type,
            weight: sets[0].weight,
          }
        } else if (type === 'Time') {
          return {
            date,
            time: sets[0].time,
            type,
          }
        } else if (type === 'Reps') {
          return {
            date,
            reps: sets[0].reps,
            type,
          }
        }
      })
    }

    const now = startOfDay(getTimestamp(Date.now()))
    let numberOfDaysWorkingOut = 0
    for (let i = 0; i < 7; i++) {
      const startDayToCheck = getTimestamp(
        startOfDay(
          addToDate(now, {
            duration: -1 * i,
            unit: 'd',
          })
        )
      )
      const endDayToCheck = getTimestamp(
        startOfDay(
          addToDate(startDayToCheck, {
            duration: 1,
            unit: 'd',
          })
        )
      )
      console.log(startDayToCheck, endDayToCheck)
      const exerciseOnDay = _.find(exercises, ({ date }) => {
        if (date > startDayToCheck) {
          // console.log(date, date > startDayToCheck, date < endDayToCheck)
        }
        return date >= startDayToCheck && date < endDayToCheck
      })
      console.log(exerciseOnDay)

      if (exerciseOnDay) {
        numberOfDaysWorkingOut = numberOfDaysWorkingOut + 1
      }
    }
    console.log(numberOfDaysWorkingOut)

    return (
      <AuthenticatedPage>
        <div className="analyze-page page">
          <ApiRequest
            apiFn={() => {
              fetchExercises()
              fetchWeight()
            }}
            onMount={true}
          />
          <div>
            <FormGroup
              label={
                <div>
                  Choose an exercise:{' '}
                  <a onClick={this.analyzeWeight}>(anaylze weight)</a>
                </div>
              }
            >
              <ExerciseNameSelect
                handleChange={this.selectExercise}
                name="exercise"
                value={selectedExercise}
              />
            </FormGroup>
          </div>
          <div className="analyze-chart">
            <h4>Stats</h4>
            <ResponsiveContainer height="100%" width="100%">
              <LineChart
                data={chartData}
                margin={{
                  right: 30,
                  bottom: 10,
                  left: 15,
                }}
              >
                <XAxis
                  dataKey="date"
                  interval={0}
                  tick={({ payload, x, y }) => (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        dy={16}
                        fill="#666"
                        fontSize="12px"
                        textAnchor="middle"
                        x={0}
                        y={0}
                      >
                        {formatDate(payload.value, 'M/DD')}
                      </text>
                    </g>
                  )}
                />
                <YAxis
                  domain={[
                    dataMin => {
                      if (isDistanceExercise || isTimeExercise) {
                        return dataMin - 0.15
                      } else if (isRepsExercise) {
                        return dataMin - 2
                      }

                      return dataMin - 10
                    },
                    dataMax => {
                      if (isDistanceExercise || isTimeExercise) {
                        return dataMax + 0.15
                      } else if (isRepsExercise) {
                        return dataMax + 2
                      }

                      return dataMax + 10
                    },
                  ]}
                  tickFormatter={value => {
                    if (isDistanceExercise || isTimeExercise) {
                      return getTimeDisplay(value)
                    }

                    return value
                  }}
                />
                <Tooltip
                  content={({ label, payload }) => {
                    if (_.isEmpty(payload)) {
                      return null
                    }

                    return (
                      <div className="tooltip-container">
                        <div className="tooltip-label">{formatDate(label)}</div>
                        <div className="tooltip-value">
                          {analyzeWeight && (
                            <div>Weight {payload[0].value} lb</div>
                          )}
                          {payload[0].payload.type === 'Distance' && (
                            <Fragment>
                              <div>Pace {getTimeDisplay(payload[0].value)}</div>
                              <div>Miles {payload[0].payload.distance}</div>
                              <div>
                                Time {getTimeDisplay(payload[0].payload.time)}
                              </div>
                            </Fragment>
                          )}
                          {payload[0].payload.type === 'Weight' && (
                            <div>Weight {payload[0].value}</div>
                          )}
                          {payload[0].payload.type === 'Time' && (
                            <div>Time {getTimeDisplay(payload[0].value)}</div>
                          )}
                          {payload[0].payload.type === 'Reps' && (
                            <div>Reps {payload[0].value}</div>
                          )}
                        </div>
                      </div>
                    )
                  }}
                  cursor={false}
                />
                <Line
                  type="monotone"
                  dataKey={({ distance, reps, time, type, weight }) => {
                    if (analyzeWeight) {
                      return weight
                    } else if (type === 'Distance') {
                      return time / distance
                    } else if (type === 'Weight') {
                      return weight
                    } else if (type === 'Time') {
                      return time
                    } else if (type === 'Reps') {
                      return reps
                    }
                  }}
                  stroke="#1698ea"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="recent-data-points">
            <h4>Recent</h4>
            <div className="recent-data-points-header">
              <div>Date</div>
              <div>Result</div>
            </div>
            {analyzeWeight &&
              _.reverse(weight).map(({ date, weight }) => (
                <div key={date} className="recent-data-point">
                  <div>{relativeDate(date)}</div>
                  <div>{weight} lb</div>
                </div>
              ))}
            {!analyzeWeight &&
              _.reverse(exercisesToAnalyze).map(({ date, sets, type }) => (
                <div key={date} className="recent-data-point">
                  <div>{relativeDate(date)}</div>
                  <div>
                    {sets
                      .map(
                        ({
                          distance,
                          distanceUnit,
                          reps,
                          time,
                          weight,
                          weightUnit,
                        }) => {
                          if (type === 'Distance') {
                            return `${distance} ${distanceUnit} - ${getTimeDisplay(
                              time
                            )} (${getTimeDisplay(time / distance)})`
                          } else if (type === 'Time') {
                            return getTimeDisplay(time)
                          } else if (type === 'Reps') {
                            return reps
                          }

                          return `${weight} ${weightUnit} (${reps} reps)`
                        }
                      )
                      .join(', ')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </AuthenticatedPage>
    )
  }
}

AnalyzePage.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.arrayOf(
        PropTypes.shape({
          distance: PropTypes.number,
          distanceUnit: PropTypes.string,
          reps: PropTypes.number,
          time: PropTypes.number,
          weight: PropTypes.number,
          weightUnit: PropTypes.string,
        })
      ).isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchExercises: PropTypes.func.isRequired,
  fetchWeight: PropTypes.func.isRequired,
  weight: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      weight: PropTypes.number.isRequired,
    })
  ).isRequired,
}

export default connect(
  state => ({
    exercises: getExercises(state),
    weight: getWeight(state),
  }),
  {
    fetchExercises,
    fetchWeight,
  }
)(AnalyzePage)
