import React from 'react'

import Select from '../fields/Select'

const DistanceUnitSelect = props => (
  <Select {...props}>
    {['mile', 'm'].map(distanceUnit => (
      <option key={distanceUnit} value={distanceUnit}>
        {distanceUnit}
      </option>
    ))}
  </Select>
)

export default DistanceUnitSelect
