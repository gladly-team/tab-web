import React from 'react'
import { mount, shallow } from 'enzyme'
import Fade from '@material-ui/core/Fade'
import Link from 'src/components/Link'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const getMockProps = () => ({
  text: 'Google Googledy',
  url: 'https://www.google.com',
  id: 'abcd',
  onEdit: jest.fn(),
  onDelete: jest.fn(),
})

describe('ShortcutIcon component', () => {
  it('renders without error', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ShortcutIcon {...mockProps} />)
    }).not.toThrow()
  })

  it('has a link with url property', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShortcutIcon {...mockProps} />)
    expect(wrapper.find(Link).prop('to')).toEqual(mockProps.url)
  })

  it('displays abbreviated version of link name along with full title', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShortcutIcon {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual('GG')
    expect(wrapper.find(Typography).at(1).text()).toEqual(mockProps.text)
  })

  it('displays edit and delete buttons on hover', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShortcutIcon {...mockProps} />)

    expect(wrapper.find(Fade).prop('in')).toEqual(false)

    wrapper.find(Fade).simulate('mouseover')

    expect(wrapper.find(Fade).prop('in')).toEqual(true)
  })

  it('calls edit and delete button on clicks', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShortcutIcon {...mockProps} />)

    wrapper.find(Fade).simulate('mouseover')

    wrapper.find(IconButton).first().simulate('click')
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id)

    wrapper.find(IconButton).at(1).simulate('click')
    expect(mockProps.onEdit).toHaveBeenCalledWith(
      mockProps.id,
      mockProps.text,
      mockProps.url
    )
  })

  it('default handlers do not throw', () => {
    const ShortcutIcon = require('src/components/ShortcutIcon').default
    const mockProps = getMockProps()
    delete mockProps.onDelete
    delete mockProps.onEdit
    const wrapper = mount(<ShortcutIcon {...mockProps} />)

    wrapper.find(Fade).simulate('mouseover')

    expect(() => {
      wrapper.find(IconButton).first().simulate('click')
    }).not.toThrow()

    expect(() => {
      wrapper.find(IconButton).at(1).simulate('click')
    }).not.toThrow()
  })
})
