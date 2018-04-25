import React from 'react'
import { shallow } from 'enzyme'

import Input from '../Input'

describe('Input Component', () => {
  test('forces value to null for a falsy input value for number inputs', () => {
    const handleChangeFn = value => {
      inputValue = value
    }
    const nonEmptyValue = 4.5
    let inputValue

    const input = shallow(
      <Input
        handleChange={handleChangeFn}
        type="number"
        value={nonEmptyValue}
      />
    )
    const inputNode = input.find('input')

    // Make sure our input has the non-empty value to start.
    expect(inputNode.props().value).toEqual(nonEmptyValue)

    // Simulate a change to an empty string value.
    inputNode.simulate('change', {
      target: {
        value: '',
      },
    })

    // Want to make sure this is null and not '' (the empty string).
    expect(inputValue).toEqual(null)
  })
})
