import React from 'react'

import AnalyzeIcon from '../icons/AnalyzeIcon'
import ExerciseIcon from '../icons/ExerciseIcon'
import Link from './Link'
import LogoutIcon from '../icons/LogoutIcon'
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
      <li>
        <Link to="/analyze">
          <AnalyzeIcon />
          <span>Analyze</span>
        </Link>
      </li>
      <li>
        <Link to="/logout">
          <LogoutIcon />
          <span>Logout</span>
        </Link>
      </li>
    </ul>
  </nav>
)

export default BottomNavigation
