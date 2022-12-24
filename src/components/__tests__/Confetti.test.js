import React from 'react'
import { shallow, mount } from 'enzyme'
import confetti from 'canvas-confetti'

jest.mock('canvas-confetti', () => ({
  create: jest.fn().mockReturnValue(() => {}),
}))

beforeEach(async () => {
  jest.clearAllMocks()
})

describe('Confetti component', () => {
  it('renders without error', () => {
    const Confetti = require('src/components/Confetti').default
    expect(() => {
      shallow(<Confetti />)
    }).not.toThrow()
  })

  it('renders the confetti canvas', async () => {
    const Confetti = require('src/components/Confetti').default
    const wrapper = mount(<Confetti />)
    expect(wrapper.find('canvas').length).toBe(1)
  })

  it('launches confetti', async () => {
    const Confetti = require('src/components/Confetti').default
    mount(<Confetti />)
    expect(confetti.create).toHaveBeenCalledTimes(2) // create is called twice on render
  })
})
