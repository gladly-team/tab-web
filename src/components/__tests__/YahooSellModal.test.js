/* globals document */

import React from 'react'
import SetYahooSearchOptInMutation from 'src/utils/mutations/SetYahooSearchOptInMutation'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import CreateSearchEnginePromptLogMutation from 'src/utils/mutations/CreateSearchEnginePromptLogMutation'
import Modal from '@material-ui/core/Modal'
import { act } from 'react-dom/test-utils'

jest.mock('src/utils/mutations/SetYahooSearchOptInMutation')
jest.mock('src/utils/mutations/SetUserSearchEngineMutation')
jest.mock('src/utils/mutations/CreateSearchEnginePromptLogMutation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  hardSell: true,
  userId: 'abcdefghijklmno',
  onAccept: jest.fn(),
  onDecline: jest.fn(),
  anchorEl: document.createElement('button'),
})

describe('YahooSellModal component', () => {
  it('renders without error', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<YahooSellModal {...mockProps} />)
    }).not.toThrow()
  })

  it('calls mutation, handler and closes on Accept', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()
    const wrapper = mount(<YahooSellModal {...mockProps} />)
    expect(wrapper.find(Modal).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's Do It!")
    acceptButton.simulate('click')

    expect(mockProps.onAccept).toHaveBeenCalled()
    expect(wrapper.find(Modal).first().prop('open')).toEqual(false)
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
  })

  it('calls mutation, handler and closes on Decline', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()
    const wrapper = mount(<YahooSellModal {...mockProps} />)
    expect(wrapper.find(Modal).first().prop('open')).toEqual(true)
    const declineButton = wrapper.find(Button).at(0)
    expect(declineButton.text()).toEqual("I don't want more impact")
    declineButton.simulate('click')

    expect(mockProps.onDecline).toHaveBeenCalled()
    expect(wrapper.find(Modal).first().prop('open')).toEqual(false)
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'Yahoo',
      false
    )
  })

  it('default handlers do not throw', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()
    delete mockProps.onDecline
    delete mockProps.onAccept

    let wrapper = mount(<YahooSellModal {...mockProps} />)
    const declineButton = wrapper.find(Button).at(0)
    expect(() => declineButton.simulate('click')).not.toThrow()

    wrapper = mount(<YahooSellModal {...mockProps} />)
    const acceptButton = wrapper.find(Button).at(1)
    expect(() => acceptButton.simulate('click')).not.toThrow()
  })

  it('text adapts to hardSell prop', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()

    let wrapper = mount(<YahooSellModal {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      "You'll love having more impact."
    )

    const newProps = {
      ...mockProps,
      hardSell: false,
    }
    wrapper = mount(<YahooSellModal {...newProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'Do even more good, for free'
    )
  })

  it('calls onClose when modal should close', () => {
    const YahooSellModal = require('src/components/YahooSellModal').default
    const mockProps = getMockProps()

    const wrapper = mount(<YahooSellModal {...mockProps} />)
    act(() => {
      wrapper.find(Modal).first().prop('onClose')()
    })
    wrapper.update()
    expect(wrapper.find(Modal).first().prop('open')).toEqual(false)
  })
})
