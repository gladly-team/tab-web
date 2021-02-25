import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

jest.mock('src/utils/urls')

const mockButtonOnClick = jest.fn()
const mockOnClose = jest.fn()
const getMockProps = () => ({
  modalType: 'confirmImpact',
  buttonOnClick: mockButtonOnClick,
  onClose: mockOnClose,
  open: true,
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

  it('renders a default dialog with functions', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const wrapper = shallow(<ImpactDialog modalType="claimImpactReward" open />)
    expect(typeof wrapper.props().onClose).toBe('function')
    expect(typeof wrapper.find(Button).props().onClick).toBe('function')
  })

  it('renders the confirmImpact dialog correctly', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'Are you ready to turn your Tabs into a force for good?'
    )
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

  it('calls buttonOnClick prop when button is clicked for claimReferralImpactReward', () => {
    const ImpactDialog = require('src/components/ImpactDialog').default
    const mockProps = { ...getMockProps(), modalType: 'claimReferralReward' }
    const wrapper = shallow(<ImpactDialog {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockButtonOnClick).toHaveBeenCalled()
  })
})
