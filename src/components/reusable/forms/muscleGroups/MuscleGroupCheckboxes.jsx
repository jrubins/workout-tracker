import React from 'react'

import MultiCheckbox from '../fields/MultiCheckbox'

const MuscleGroupCheckboxes = props => (
  <MultiCheckbox
    {...props}
    options={[
      {
        label: 'Abs',
        value: 'Abs',
      },
      {
        label: 'Back',
        value: 'Back',
      },
      {
        label: 'Biceps',
        value: 'Biceps',
      },
      {
        label: 'Chest',
        value: 'Chest',
      },
      {
        label: 'Hamstrings',
        value: 'Hamstrings',
      },
      {
        label: 'Shoulders',
        value: 'Shoulders',
      },
      {
        label: 'Triceps',
        value: 'Triceps',
      },
    ]}
  />
)

export default MuscleGroupCheckboxes
