import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getExercises } from '../../../../reducers'

import Select from '../fields/Select'

const ExerciseNameSelect = ({ data, ...rest }) => {
  const exerciseNames = _.sortBy(_.uniq(_.map(data, 'name')))

  return (
    <Select {...rest}>
      {exerciseNames.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </Select>
  )
}

ExerciseNameSelect.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default connect(state => ({
  data: getExercises(state),
}))(ExerciseNameSelect)
