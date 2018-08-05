import React from 'react'

import Select from '../fields/Select'

const ExerciseCategorySelect = props => (
  <Select {...props}>
    {['Distance', 'Reps', 'Time', 'Weight'].map(category => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </Select>
)

export default ExerciseCategorySelect
