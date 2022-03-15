import React from 'react'
import { mount, shallow } from 'enzyme'
/* globals window */

import LogSearchMutation from 'src/utils/mutations/LogSearchMutation'
import Input from '@material-ui/core/Input'

jest.mock('src/utils/mutations/LogSearchMutation')

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
})

window.open = jest.fn()

// TODO: more tests
describe('SearchInput component', () => {
  it('renders without error', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchInput {...mockProps} />)
    }).not.toThrow()
  })

  it('calls LogTab mutation onSearch', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)
    const searchTextField = wrapper.find(Input)
    searchTextField
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    searchTextField.find('input').simulate('keypress', { key: 'Enter' })
    expect(LogSearchMutation).toHaveBeenCalledWith({
      userId: mockProps.userId,
      source: 'tab',
    })
  })
})
