import React from 'react'
import { mount } from 'enzyme'

const getMockProps = () => ({
  children: '# Hi there!',
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Markdown component', () => {
  it('renders without error', () => {
    const Markdown = require('src/components/Markdown').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<Markdown {...mockProps} />)
    }).not.toThrow()
  })
})
