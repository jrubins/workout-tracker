import React from 'react'

import Select from '../fields/Select'

const WeightUnitSelect = props => (
  <Select {...props}>
    {['lb', 'kg'].map(exerciseType => (
      <option key={exerciseType} value={exerciseType}>
        {exerciseType}
      </option>
    ))}
  </Select>
)

export default WeightUnitSelect
