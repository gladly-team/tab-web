import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

jest.mock('src/utils/urls')

const mockOnClick = jest.fn()
const getMockProps = () => ({
  buttonOnClick: mockOnClick,
  buttonText: 'some text',
  text: <div>dummy text</div>,
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

  it('renders the component passed into "text" prop', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = {
      ...getMockProps(),
      text: <Typography>sameText</Typography>,
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    const typography = wrapper.find(Typography).first()
    expect(typography.text()).toEqual('sameText')
  })

  it('renders the button text prop', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(clickButton.text()).toEqual('some text')
  })

  it('does not render a button if includeButton is set to false', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <Notification {...mockProps} includeButton={false} />
    )
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('does not render a second button if includeSecondaryButton is set to false/unset', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)

    // Renders only the first button
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('does render a second button if includeSecondaryButton is set to true', () => {
    const Notification = require('src/components/Notification').default
    const secondaryButtonOnClick = jest.fn()
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonOnClick,
      secondaryButtonText: 'secondButton',
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    const clickButton = wrapper.find(Button).first()
    expect(clickButton.text()).toEqual('secondButton')
  })

  it('calls secondaryButtonOnClick prop when second button is clicked', () => {
    const Notification = require('src/components/Notification').default
    const secondaryButtonOnClick = jest.fn()
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonOnClick,
      secondaryButtonText: 'secondButton',
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    const clickButton = wrapper.find(Button).first()
    expect(secondaryButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(secondaryButtonOnClick).toHaveBeenCalled()
  })

  it('renders null if not open', () => {
    const Notification = require('src/components/Notification').default
    const mockProps = {
      ...getMockProps(),
      open: false,
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.type()).toEqual(null)
  })
})
