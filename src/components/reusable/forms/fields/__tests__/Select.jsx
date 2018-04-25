import React from 'react'
import { shallow } from 'enzyme'

import Select from '../Select'

describe('Select Component', () => {
  test('forces selected value to null for selected empty string options', () => {
    const handleChangeFn = value => {
      selectedValue = value
    }
    const emptyOptionValue = ''
    const nonEmptyOptionValue = 'Non Empty Option'
    let selectedValue

    const select = shallow(
      <Select
        handleChange={handleChangeFn}
        name="test-select"
        value={nonEmptyOptionValue}
      >
        <option value={emptyOptionValue}>Empty Option</option>
        <option value={nonEmptyOptionValue}>Non Empty Option</option>
      </Select>
    )

    // Simulate a change to the empty option.
    select.find('select').simulate('change', {
      target: {
        value: emptyOptionValue,
      },
    })

    // Want to make sure this is null and not '' (the empty string).
    expect(selectedValue).toEqual(null)
  })

  test('allows the empty option label to be specified', () => {
    const emptyOptionLabel = 'Tests are great'

    // This should render a select with an empty option selected.
    const select = shallow(
      <Select
        emptyOptionLabel={emptyOptionLabel}
        handleChange={() => {}} // eslint-disable-line no-empty-function
        name="test-select"
        value={''}
      >
        <option value="non-empty-option">Not Empty</option>
      </Select>
    )

    // Expect the first option of our select (the empty option) to have the supplied label.
    expect(
      select
        .find('option')
        .at(0)
        .text()
    ).toEqual(emptyOptionLabel)
  })
})
