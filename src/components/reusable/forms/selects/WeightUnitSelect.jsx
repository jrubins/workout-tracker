import React from 'react'

import Select from '../fields/Select'

const WeightUnitSelect = props => (
  <Select {...props}>
    {['lb', 'kg'].map(weightUnit => (
      <option key={weightUnit} value={weightUnit}>
        {weightUnit}
      </option>
    ))}
  </Select>
)

export default WeightUnitSelect
