import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({})

// TODO: more tests
describe('SearchInput component', () => {
  it('renders without error', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchInput {...mockProps} />)
    }).not.toThrow()
  })
})
