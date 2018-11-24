import React from 'react'
import _ from 'lodash'
import ApiRequest from '@jrubins/react-components/lib/api/ApiRequest'

import { fetchExerciseTypes } from '../../../../services/api/exerciseTypes'

import { UserContext } from '../../../contexts'
import Select from '../fields/Select'

const ExerciseNameSelect = props => (
  <UserContext.Consumer>
    {({ jwt }) => (
      <ApiRequest apiFn={() => fetchExerciseTypes({ jwt })} onMount={true}>
        {({ data }) => (
          <Select {...props}>
            {_.orderBy(_.get(data, 'data', []), 'name').map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        )}
      </ApiRequest>
    )}
  </UserContext.Consumer>
)

export default ExerciseNameSelect
