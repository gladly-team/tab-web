/* eslint react/jsx-props-no-spreading: 0, global-require: 0 */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  color: 'purple',
  includeText: false,
})

describe('Logo component', () => {
  it('renders without error', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    shallow(<Logo {...mockProps} />)
  })

  it('has a default height of 40px', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.style = {}
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toMatchObject({
      height: 40,
    })
  })

  it('assigns style to the img element', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.style = {
      border: 'teal 2px dotted',
      background: '#ff0000',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toMatchObject({
      border: 'teal 2px dotted',
      background: '#ff0000',
    })
  })

  // The alt text can cause a flash of text on Firefox before the
  // image loads.
  it('does not contain alt text', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('alt')).toBeUndefined()
  })

  it('defaults to the purple "tab" logo', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    delete mockProps.brand
    delete mockProps.color
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('throws an error when passed an invalid brand', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.brand = 'coolApp'
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).toThrow('No logo exists for brand "coolApp".')
  })

  it('uses the correct file for color=default', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'default'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=purple', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'purple'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=white', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'white'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-white.svg')
  })

  it('uses the correct file for color=grey', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'white'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-white.svg')
  })

  it('uses the correct file for includeText=true', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.includeText = true
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-with-text.svg')
  })

  it('uses the same file for includeText=true even when another (unsupported) color is provided', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.includeText = true
    mockProps.color = 'white'
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-with-text.svg')
  })

  it('throws an error when passed an invalid color', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    mockProps.color = 'orange'
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).toThrow('No "tab" logo exists with color "orange"')
  })
})
