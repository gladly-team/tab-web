import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  children: <div>I am a child</div>,
})

describe('SettingsPage component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SettingsPage {...mockProps} />)
    }).not.toThrow()
  })
})
