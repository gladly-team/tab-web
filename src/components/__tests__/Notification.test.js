import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'

jest.mock('src/utils/urls')

const mockOnClick = jest.fn()
const getMockProps = () => ({
  buttonOnClick: mockOnClick,
})

describe('Notification component', () => {
  it('renders without error', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Notification {...mockProps} />)
    }).not.toThrow()
  })

  it('calls buttonOnClick prop when button is clicked', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockOnClick).toHaveBeenCalled()
  })
})
