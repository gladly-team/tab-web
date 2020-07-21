import React from 'react'
import { shallow } from 'enzyme'
import NextJsLink from 'next/link'

jest.mock('next/link', () => (props) => (
  <div data-test-id="mock-next-js-link">{props.children}</div>
))
jest.mock('src/utils/urls')

const getMockProps = () => ({
  children: 'hi',
  className: 'some-class',
  to: '/some/url',
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
    const anchor = wrapper.childAt(0)
    expect(anchor.prop('className')).toContain('some-class-here')
  })
})
