import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

jest.mock('src/utils/urls')
jest.mock('src/components/SocialShare')

const mockButtonOnClick = jest.fn()
const mockOnClose = jest.fn()
const getMockProps = () => ({
  modalType: 'confirmImpact',
  buttonOnClick: mockButtonOnClick,
  onClose: mockOnClose,
  open: true,
  user: {
    username: 'someUsername',
  },
})
beforeEach(() => {
  jest.clearAllMocks()
})

describe('ImpactDialog component', () => {
  it('renders without error', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ImpactDialog {...mockProps} />)
    }).not.toThrow()
  })

  it('renders the confirmImpact dialog correctly', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'Are you ready to turn your Tabs into a force for good?'
    )
  })

  it('thows the confirmImpact dialog correctly if buttonOnClick is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = { ...getMockProps(), buttonOnClick: undefined }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('calls buttonOnClick prop when button is clicked for confirmImpact', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockButtonOnClick).toHaveBeenCalled()
  })

  it('renders the impactWalkMe dialog correctly', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = { ...getMockProps(), modalType: 'impactWalkMe' }
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual('Open a new tab')
  })

  it('renders the claimImpactReward dialog correctly', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = { ...getMockProps(), modalType: 'claimImpactReward' }
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'You just helped a shelter cat! Congrats!'
    )
  })

  it('thows the claimImpactReward dialog correctly if buttonOnClick is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      modalType: 'claimImpactReward',
      buttonOnClick: undefined,
    }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('thows the claimImpactReward dialog correctly if user is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      modalType: 'claimImpactReward',
      user: undefined,
    }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('calls buttonOnClick prop when button is clicked for claimImpactReward', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockButtonOnClick).toHaveBeenCalled()
  })

  it('renders the claimReferralImpactReward dialog correctly', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      modalType: 'claimReferralReward',
      referralImpact: 9001,
    }
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'You just put 9001 cats on track for adoption!'
    )
  })

  it('thows the claimReferralImpactReward dialog correctly if buttonOnClick is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      modalType: 'claimReferralReward',
      buttonOnClick: undefined,
      referralImpact: 9001,
    }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('thows the claimReferralImpactReward dialog correctly if user is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      ...getMockProps(),
      modalType: 'claimReferralReward',
      buttonOnClick: () => {},
      referralImpact: 9001,
      user: undefined,
    }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('thows the claimReferralImpactReward dialog correctly if referralImpact is undefined', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      ...getMockProps(),
      modalType: 'claimReferralReward',
      buttonOnClick: () => {},
      referralImpact: undefined,
      user: { username: 'username' },
    }
    expect(() => shallow(<ImpactDialog {...mockProps} />)).toThrow()
  })

  it('calls buttonOnClick prop when button is clicked for claimReferralImpactReward', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = {
      ...getMockProps(),
      modalType: 'claimReferralReward',
      referralImpact: 10,
    }
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockButtonOnClick).toHaveBeenCalled()
  })
})
