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
  onSwitchToSearchForACause: jest.fn(),
})

describe('SearchForACauseSellNotification component', () => {
  it('renders without error', () => {
    const SearchForACauseSellNotification =
      require('src/components/SearchForACauseSellNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchForACauseSellNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('calls handler and closes on clicking learn more', () => {
    const SearchForACauseSellNotification =
      require('src/components/SearchForACauseSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual('Learn More')
    acceptButton.simulate('click')

    // todo: @jtan add closing test
    expect(mockProps.onLearnMore).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('calls mutation, handler and closes on clicking no thanks', () => {
    const SearchForACauseSellNotification =
      require('src/components/SearchForACauseSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual('No Thanks')
    acceptButton.simulate('click')

    // todo: @jtan add closing test
    expect(mockProps.onNoThanks).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'SearchForACause',
      false
    )
  })

  it('calls appropriate mutations and closes on accepting', () => {
    const SearchForACauseSellNotification =
      require('src/components/SearchForACauseSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(2)
    expect(acceptButton.text()).toEqual("Let's do it!")
    acceptButton.simulate('click')

    expect(SetUserSearchEngineMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'SearchForACause'
    )
    expect(SetYahooSearchOptInMutation).toHaveBeenCalledWith(
      mockProps.userId,
      true
    )
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'SearchForACause',
      true
    )

    expect(mockProps.onSwitchToSearchForACause).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('default handlers do not throw', () => {
    const SearchForACauseSellNotification =
      require('src/components/SearchForACauseSellNotification').default
    const mockProps = getMockProps()
    delete mockProps.onLearnMore
    delete mockProps.onNoThanks
    delete mockProps.onSwitchToSearchForACause

    let wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    const onLearnMoreButton = wrapper.find(Button).at(0)
    expect(() => onLearnMoreButton.simulate('click')).not.toThrow()

    wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    const onNoThanksButton = wrapper.find(Button).at(1)
    expect(() => onNoThanksButton.simulate('click')).not.toThrow()

    wrapper = mount(<SearchForACauseSellNotification {...mockProps} />)
    const onSwitchToSearchForACauseButton = wrapper.find(Button).at(0)
    expect(() =>
      onSwitchToSearchForACauseButton.simulate('click')
    ).not.toThrow()
  })
})
