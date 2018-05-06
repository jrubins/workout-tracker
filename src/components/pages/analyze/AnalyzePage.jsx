import React, { Component } from 'react'
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

import { formatDate } from '../../../utils/dates'

import { getExercises } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'

import ApiRequest from '../../reusable/api/ApiRequest'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import ExerciseNameSelect from '../../reusable/forms/selects/ExerciseNameSelect'
import FormGroup from '../../reusable/forms/FormGroup'

class AnalyzePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedExercise: null,
    }

    this.selectExercise = this.selectExercise.bind(this)
  }

  /**
   * Selects an exercise to analyze.
   *
   * @param {String} selectedExercise
   */
  selectExercise(selectedExercise) {
    this.setState({
      selectedExercise,
    })
  }

  render() {
    const { data, fetchExercises } = this.props
    const { selectedExercise } = this.state
    const exercisesToAnalyze = _.filter(
      data,
      ({ name, sets }) => name === selectedExercise && sets.length > 0
    )
    console.log(exercisesToAnalyze)
    const chartData = _.map(exercisesToAnalyze, ({ date, sets }) => ({
      date,
      miles: sets[0].distance,
      min: sets[0].time,
    }))

    return (
      <AuthenticatedPage>
        <div className="analyze-page page">
          <ApiRequest apiFn={fetchExercises} onMount={true} />
          <div>
            <FormGroup label="Choose an exercise:">
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
                // Below are arbitrary numbers. Need to update.
                height={250}
                margin={{
                  right: 30,
                  bottom: 60,
                }}
                width={730}
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
                        textAnchor="end"
                        transform="rotate(-25)"
                        x={0}
                        y={0}
                      >
                        {formatDate(payload.value)}
                      </text>
                    </g>
                  )}
                />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip
                  content={({ payload }) => {
                    if (_.isEmpty(payload)) {
                      return null
                    }

                    return payload.value
                  }}
                  cursor={false}
                />
                <Line
                  type="monotone"
                  dataKey={({ miles, min }) => min / miles}
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AuthenticatedPage>
    )
  }
}

AnalyzePage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.array.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchExercises: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    data: getExercises(state),
  }),
  {
    fetchExercises,
  }
)(AnalyzePage)
