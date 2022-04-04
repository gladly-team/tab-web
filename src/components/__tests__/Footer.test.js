import React from 'react'
import { mount } from 'enzyme'

describe('Footer', () => {
  it('renders without error', () => {
    const Footer = require('../Footer').default
    expect(() => mount(<Footer />)).not.toThrow()
  })
})
