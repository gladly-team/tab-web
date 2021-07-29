import React from 'react'
import { mount } from 'enzyme'
import Button from '@material-ui/core/Button'
import Link from 'src/components/Link'

jest.mock('src/components/Link')
const getMockProps = (status) => ({
  status,
})

describe('MissionHubButton component', () => {
  it('renders without error', () => {
    const MissionHubButton = require('src/components/MissionHubButton').default
    expect(() => {
      mount(<MissionHubButton {...getMockProps('pending')} />)
    }).not.toThrow()
  })

  it('renders the correct text when pending', () => {
    const MissionHubButton = require('src/components/MissionHubButton').default
    const wrapper = mount(<MissionHubButton {...getMockProps('pending')} />)
    const missionButton = wrapper.find(Button)
    expect(missionButton.text()).toBe('mission pending')
  })

  it('renders the correct text when no missions', () => {
    const MissionHubButton = require('src/components/MissionHubButton').default
    const wrapper = mount(<MissionHubButton {...getMockProps('')} />)
    const missionButton = wrapper.find(Button)
    expect(missionButton.text()).toBe('create a squad')
  })

  it('renders the correct text when mission has started', () => {
    const MissionHubButton = require('src/components/MissionHubButton').default
    const wrapper = mount(<MissionHubButton {...getMockProps('started')} />)
    const missionButton = wrapper.find(Button)
    expect(missionButton.text()).toBe('mission hub')
  })

  it('renders the correct text when mission has completed', () => {
    const MissionHubButton = require('src/components/MissionHubButton').default
    const wrapper = mount(<MissionHubButton {...getMockProps('completed')} />)
    const missionButton = wrapper.find(Button)
    expect(missionButton.text()).toBe('mission hub')
  })
})
