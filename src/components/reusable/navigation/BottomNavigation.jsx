import React from 'react'

import ExerciseIcon from '../icons/ExerciseIcon'
import Link from './Link'
import WeightIcon from '../icons/WeightIcon'

const BottomNavigation = () => (
  <nav className="bottom-navigation">
    <ul>
      <li>
        <Link to="/exercises">
          <ExerciseIcon />
          <span>Exercises</span>
        </Link>
      </li>
      <li>
        <Link to="/weight">
          <WeightIcon />
          <span>Weight</span>
        </Link>
      </li>
    </ul>
  </nav>
)

export default BottomNavigation
