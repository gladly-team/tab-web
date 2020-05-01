import React from 'react'
import { shallow } from 'enzyme'
import Logo from 'src/components/Logo'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({})

describe('FullPageLoader component', () => {
  it('renders without error', () => {
    const FullPageLoader = require('src/components/FullPageLoader').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<FullPageLoader {...mockProps} />)
    }).not.toThrow()
  })

  it('contains the logo', () => {
    const FullPageLoader = require('src/components/FullPageLoader').default
    const mockProps = getMockProps()
    const wrapper = shallow(<FullPageLoader {...mockProps} />)
    expect(wrapper.find(Logo).exists()).toBe(true)
  })

  it('says "Loading..."', () => {
    const FullPageLoader = require('src/components/FullPageLoader').default
    const mockProps = getMockProps()
    const wrapper = shallow(<FullPageLoader {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .render()
        .text()
    ).toEqual('Loading...')
  })
})
