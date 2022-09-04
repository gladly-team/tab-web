import React from 'react'
import { mount, shallow } from 'enzyme'
import IconButton from '@material-ui/core/IconButton'
import { CheckCircle } from '@material-ui/icons'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'

const getMockProps = () => ({
  onClick: jest.fn(),
  active: true,
})

describe('SfacActivityButton component', () => {
  it('renders without error', () => {
    const SfacActivityButton =
      require('src/components/SfacActivityButton').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SfacActivityButton {...mockProps} />)
    }).not.toThrow()
  })

  it('calls onClick on click', () => {
    const SfacActivityButton =
      require('src/components/SfacActivityButton').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityButton {...mockProps} />)
    const button = wrapper.find(IconButton)

    button.simulate('click')
    expect(mockProps.onClick).toHaveBeenCalled()
  })

  it('renders a check mark icon on active SFAC user', () => {
    const SfacActivityButton =
      require('src/components/SfacActivityButton').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityButton {...mockProps} />)
    expect(wrapper.find(CheckCircle).exists()).toBe(true)
  })

  it('renders a do not disturb icon on active SFAC user', () => {
    const SfacActivityButton =
      require('src/components/SfacActivityButton').default
    const mockProps = {
      ...getMockProps(),
      active: false,
    }
    const wrapper = mount(<SfacActivityButton {...mockProps} />)
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toBe(true)
  })
})
