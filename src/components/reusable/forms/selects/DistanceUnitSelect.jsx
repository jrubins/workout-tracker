import React from 'react'

import Select from '../fields/Select'

const DistanceUnitSelect = props => (
  <Select {...props}>
    {['mile', 'm'].map(exerciseType => (
      <option key={exerciseType} value={exerciseType}>
        {exerciseType}
      </option>
    ))}
  </Select>
)

export default DistanceUnitSelect
