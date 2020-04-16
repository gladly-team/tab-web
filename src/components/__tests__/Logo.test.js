/* eslint react/jsx-props-no-spreading: 0, global-require: 0 */

import React from 'react'
import { shallow } from 'enzyme'

// TODO:
// - configure specific eslint rules for test files:
//   https://stackoverflow.com/a/49211283
// - fix setupTests to throw when console.warn is called

const getMockProps = () => ({
  color: 'purple',
  includeText: false,
})

describe('Logo component', () => {
  it('renders without error', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).not.toThrow()
  })

  it('has a default height of 40px', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      style: undefined,
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toMatchObject({
      height: 40,
    })
  })

  it('assigns style to the img element', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      style: {
        border: 'teal 2px dotted',
        background: '#ff0000',
      },
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
    const mockProps = {
      ...getMockProps(),
      color: undefined,
      includeText: false,
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=default', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      color: 'default',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=purple', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      color: 'purple',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo.svg')
  })

  it('uses the correct file for color=white', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      color: 'white',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-white.svg')
  })

  it('uses the correct file for color=grey', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      color: 'grey',
    }
    const wrapper = shallow(<Logo {...mockProps} />)
    expect(wrapper.find('img').prop('src')).toEqual('logo-grey.svg')
  })

  it('uses the correct file for includeText=true', () => {
    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      includeText: true,
    }
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
    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const Logo = require('src/components/Logo').default
    const mockProps = {
      ...getMockProps(),
      color: 'orange',
    }
    expect(() => {
      shallow(<Logo {...mockProps} />)
    }).toThrow('No "tab" logo exists with color "orange"')
  })
})
