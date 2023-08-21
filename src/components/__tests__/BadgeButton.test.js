import React from 'react'
import { mount, shallow } from 'enzyme'
import IconButton from '@material-ui/core/IconButton'
import { CheckCircle } from '@material-ui/icons'
import SearchIcon from '@material-ui/icons/Search'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'

const getMockProps = () => ({
  onClick: jest.fn(),
  active: true,
  icon: <SearchIcon />,
})

describe('BadgeButton component', () => {
  it('renders without error', () => {
    const BadgeButton = require('src/components/BadgeButton').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<BadgeButton {...mockProps} />)
    }).not.toThrow()
  })

  it('renders a passed in icon', () => {
    const BadgeButton = require('src/components/BadgeButton').default
    const mockProps = getMockProps()
    const wrapper = mount(<BadgeButton {...mockProps} />)
    expect(wrapper.find(SearchIcon).exists()).toEqual(true)
  })

  it('calls onClick on click', () => {
    const BadgeButton = require('src/components/BadgeButton').default
    const mockProps = getMockProps()
    const wrapper = mount(<BadgeButton {...mockProps} />)
    const button = wrapper.find(IconButton)

    button.simulate('click')
    expect(mockProps.onClick).toHaveBeenCalled()
  })

  it('renders a check mark icon on active SFAC user', () => {
    const BadgeButton = require('src/components/BadgeButton').default
    const mockProps = getMockProps()
    const wrapper = mount(<BadgeButton {...mockProps} />)
    expect(wrapper.find(CheckCircle).exists()).toBe(true)
  })

  it('renders a do not disturb icon on active SFAC user', () => {
    const BadgeButton = require('src/components/BadgeButton').default
    const mockProps = {
      ...getMockProps(),
      active: false,
    }
    const wrapper = mount(<BadgeButton {...mockProps} />)
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toBe(true)
  })
})
