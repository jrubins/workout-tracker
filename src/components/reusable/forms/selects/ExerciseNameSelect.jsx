import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { fetchExerciseTypes } from '../../../../services/api/exerciseTypes'

import { getUserJwt } from '../../../../reducers'

import ApiRequest from '../../api/ApiRequest'
import Select from '../fields/Select'

const ExerciseNameSelect = ({ jwt, ...rest }) => (
  <ApiRequest apiFn={() => fetchExerciseTypes({ jwt })} onMount={true}>
    {({ data }) => (
      <Select {...rest}>
        {_.orderBy(_.get(data, 'data', []), 'name').map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    )}
  </ApiRequest>
)

ExerciseNameSelect.propTypes = {
  jwt: PropTypes.string.isRequired,
}

export default connect(state => ({
  jwt: getUserJwt(state),
}))(ExerciseNameSelect)
