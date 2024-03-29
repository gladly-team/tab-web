import React from 'react'
import TextField from '@material-ui/core/TextField'
import { mount, shallow } from 'enzyme'
import SocialShare from 'src/components/SocialShare'

const getMockProps = () => ({
  baseURL: undefined,
  user: {
    username: 'bob',
    cause: {
      landingPagePath: '/cats/',
      sharing: {},
    },
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
      'https://tab.gladly.io/cats/?u=bob'
    )
  })

  it('contains the correct referral URL, using tab.gladly.io by default and /teamseas/ landingPagePath', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'bob'
    mockProps.user.cause.landingPagePath = '/teamseas/'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/teamseas/?u=bob'
    )
  })

  it('encodes the referral URL correctly when the username contains a space', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'Bugs Bunny'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Bugs%20Bunny'
    )
  })

  it('encodes the referral URL correctly when the username contains a plus sign', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'my+username'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=my%2Busername'
    )
  })

  it('encodes the referral URL correctly when the username contains an emoji', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = 'Stinky💩'
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(TextField).first().prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Stinky%F0%9F%92%A9'
    )
  })

  it('contains the correct referral URL when there is no provided username', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    mockProps.user.username = undefined
    const wrapper = mount(<InviteFriends {...mockProps} />)
    const referralUrl = 'https://tab.gladly.io/cats/'
    expect(wrapper.find(TextField).first().prop('value')).toBe(referralUrl)
  })

  it('renders social share', () => {
    const InviteFriends = require('src/components/InviteFriends').default
    const mockProps = getMockProps()
    const wrapper = mount(<InviteFriends {...mockProps} />)
    expect(wrapper.find(SocialShare).length).toEqual(1)
  })
})
