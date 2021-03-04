/* eslint-env jest */

import React from 'react'
import TextField from '@material-ui/core/TextField'
import { mount, shallow } from 'enzyme'

const getMockProps = () => ({
  baseURL: undefined,
  user: {
    username: 'bob',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Invite friend component', () => {
  it('renders without error', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    expect(() => shallow(<InviteFriends {...mockProps} />)).not.toThrow()
  })

  it('contains the correct referral URL, using tab.gladly.io by default', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'bob'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/?u=bob'
    )
  })

  it('contains the correct referral URL when passed a custom "baseURL" prop value', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.baseURL = 'https://foo.example.com'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://foo.example.com/?u=bob'
    )
  })

  it('encodes the referral URL correctly when the username contains a space', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'Bugs Bunny'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/?u=Bugs%20Bunny'
    )
  })

  it('encodes the referral URL correctly when the username contains a plus sign', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'my+username'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/?u=my%2Busername'
    )
  })

  it('encodes the referral URL correctly when the username contains an emoji', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'Stinky💩'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/?u=Stinky%F0%9F%92%A9'
    )
  })

  it('contains the correct referral URL when there is no provided username', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = undefined
    const wrapper = mount(<InviteFriends {...mockProps} />)
    const referralUrl = 'https://tab.gladly.io'
    expect(wrapper.find(TextField).first().prop('value')).toBe(referralUrl)
  })

  it('contains the correct referral URL when there is no user', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user = undefined
    const wrapper = mount(<InviteFriends {...mockProps} />)
    const referralUrl = 'https://tab.gladly.io'
    expect(wrapper.find(TextField).first().prop('value')).toBe(referralUrl)
  })
})
