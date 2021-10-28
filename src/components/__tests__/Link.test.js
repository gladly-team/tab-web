import React from 'react'
import { mount, shallow } from 'enzyme'
import NextJsLink from 'next/link'
import { isURLForDifferentApp, withBasePath } from 'src/utils/navigationUtils'

jest.mock('next/link')
jest.mock('src/utils/urls')
jest.mock('src/utils/navigationUtils')

const getMockProps = () => ({
  children: 'hi',
  className: 'some-class',
  to: 'https://tab.gladly.io/newtab/blah/',
  target: undefined,
})

beforeEach(() => {
  withBasePath.mockImplementation((url) => url)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Link component', () => {
  it('renders without error', () => {
    const Link = require('src/components/Link').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Link {...mockProps} />)
    }).not.toThrow()
  })

  it('returns a Next.js Link component', () => {
    const Link = require('src/components/Link').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Link {...mockProps} />)
    expect(wrapper.type()).toEqual(NextJsLink)
  })

  it('has an anchor as a child of the Next.js Link component', () => {
    const Link = require('src/components/Link').default
    const mockProps = getMockProps()
    const wrapper = shallow(<Link {...mockProps} />)
    expect(wrapper.childAt(0).type()).toEqual('a')
  })

  it('passes the "to" prop value to the Next.js Link "href" prop', () => {
    const Link = require('src/components/Link').default
    const mockProps = {
      ...getMockProps(),
      to: '/my/thing',
    }
    const wrapper = shallow(<Link {...mockProps} />)
    expect(wrapper.at(0).prop('href')).toEqual('/my/thing')
  })

  it('assigns the className prop to the anchor', () => {
    const Link = require('src/components/Link').default
    const mockProps = {
      ...getMockProps(),
      className: 'some-class-here',
    }
    const wrapper = shallow(<Link {...mockProps} />)
    const anchor = wrapper.find('a').first()
    expect(anchor.prop('className')).toContain('some-class-here')
  })

  it('assigns the style prop to the anchor', () => {
    const Link = require('src/components/Link').default
    const mockProps = {
      ...getMockProps(),
      style: { fontSize: 88 },
    }
    const wrapper = shallow(<Link {...mockProps} />)
    const anchor = wrapper.find('a').first()
    expect(anchor.prop('style')).toMatchObject({ fontSize: 88 })
  })

  it('has no target prop on anchor tag by default', () => {
    const Link = require('src/components/Link').default

    const wrapper = shallow(<Link {...getMockProps()} />)
    const anchor = wrapper.find('a').first()
    expect(anchor.prop('target')).toBeUndefined()
  })

  it('sets target to _top for external app', () => {
    isURLForDifferentApp.mockReturnValue(true)
    const Link = require('src/components/Link').default

    const mockProps = {
      ...getMockProps(),
      url: 'https://blahblah.com',
    }
    const wrapper = mount(<Link {...mockProps} />)
    const anchor = wrapper.find('a').first()
    expect(anchor.prop('target')).toEqual('_top')
  })

  it('includes the base path when calling isURLForDifferentApp', () => {
    const Link = require('src/components/Link').default
    withBasePath.mockImplementation((url) => `/my-base-path${url}`)
    const mockProps = {
      ...getMockProps(),
      to: '/my/thing',
    }
    mount(<Link {...mockProps} />)
    expect(isURLForDifferentApp).toHaveBeenCalledWith(`/my-base-path/my/thing`)
  })

  it('assigns the "target" prop to the anchor if it is provided', () => {
    const Link = require('src/components/Link').default
    const mockProps = {
      ...getMockProps(),
      target: '_blank',
    }
    const wrapper = shallow(<Link {...mockProps} />)
    expect(wrapper.find('a').first().prop('target')).toEqual('_blank')
  })

  it('uses the "target" prop when provided, rather than target="_top", when it is an external link', () => {
    const Link = require('src/components/Link').default
    const mockProps = {
      ...getMockProps(),
      url: 'https://blahblah.com',
      target: '_blank',
    }
    const wrapper = shallow(<Link {...mockProps} />)
    expect(wrapper.find('a').first().prop('target')).toEqual('_blank')
  })
})
