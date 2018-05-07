import React from 'react'

import Select from '../fields/Select'

const ExerciseTypeSelect = props => (
  <Select {...props}>
    {['Distance', 'Reps', 'Time', 'Weight'].map(exerciseType => (
      <option key={exerciseType} value={exerciseType}>
        {exerciseType}
      </option>
    ))}
  </Select>
)

export default ExerciseTypeSelect
