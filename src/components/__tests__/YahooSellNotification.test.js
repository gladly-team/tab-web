import React from 'react'
import SetYahooSearchOptInMutation from 'src/utils/mutations/SetYahooSearchOptInMutation'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import CreateSearchEnginePromptLogMutation from 'src/utils/mutations/CreateSearchEnginePromptLogMutation'
import Notification from '../Notification'

jest.mock('src/utils/mutations/SetYahooSearchOptInMutation')
jest.mock('src/utils/mutations/SetUserSearchEngineMutation')
jest.mock('src/utils/mutations/CreateSearchEnginePromptLogMutation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  onLearnMore: jest.fn(),
  onNoThanks: jest.fn(),
  onSwitchToYahoo: jest.fn(),
})

describe('YahooSellNotification component', () => {
  it('renders without error', () => {
    const YahooSellNotification =
      require('src/components/YahooSellNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<YahooSellNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('calls handler and closes on clicking learn more', () => {
    const YahooSellNotification =
      require('src/components/YahooSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<YahooSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual('Learn More')
    acceptButton.simulate('click')

    // todo: @jtan add closing test
    expect(mockProps.onLearnMore).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('calls mutation, handler and closes on clicking no thanks', () => {
    const YahooSellNotification =
      require('src/components/YahooSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<YahooSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual('No Thanks')
    acceptButton.simulate('click')

    // todo: @jtan add closing test
    expect(mockProps.onNoThanks).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'Yahoo',
      false
    )
  })

  it('calls appropriate mutations and closes on accepting', () => {
    const YahooSellNotification =
      require('src/components/YahooSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<YahooSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(2)
    expect(acceptButton.text()).toEqual('Switch to Yahoo')
    acceptButton.simulate('click')

    expect(SetUserSearchEngineMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'Yahoo'
    )
    expect(SetYahooSearchOptInMutation).toHaveBeenCalledWith(
      mockProps.userId,
      true
    )
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'Yahoo',
      true
    )

    expect(mockProps.onSwitchToYahoo).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('default handlers do not throw', () => {
    const YahooSellNotification =
      require('src/components/YahooSellNotification').default
    const mockProps = getMockProps()
    delete mockProps.onLearnMore
    delete mockProps.onNoThanks
    delete mockProps.onSwitchToYahoo

    let wrapper = mount(<YahooSellNotification {...mockProps} />)
    const onLearnMoreButton = wrapper.find(Button).at(0)
    expect(() => onLearnMoreButton.simulate('click')).not.toThrow()

    wrapper = mount(<YahooSellNotification {...mockProps} />)
    const onNoThanksButton = wrapper.find(Button).at(1)
    expect(() => onNoThanksButton.simulate('click')).not.toThrow()

    wrapper = mount(<YahooSellNotification {...mockProps} />)
    const onSwitchToYahooButton = wrapper.find(Button).at(0)
    expect(() => onSwitchToYahooButton.simulate('click')).not.toThrow()
  })
})
