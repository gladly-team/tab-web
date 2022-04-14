/* globals document */

import React from 'react'
import SetYahooSearchOptInMutation from 'src/utils/mutations/SetYahooSearchOptInMutation'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import CreateSearchEnginePromptLogMutation from 'src/utils/mutations/CreateSearchEnginePromptLogMutation'
import Modal from '@material-ui/core/Modal'

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
  onClose: jest.fn(),
  open: true,
})

describe('SearchForACauseSellModal component', () => {
  it('renders without error', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchForACauseSellModal {...mockProps} />)
    }).not.toThrow()
  })

  it('calls mutation, handler and calls onClose on Accept', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    expect(wrapper.find(Modal).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's Do It!")
    acceptButton.simulate('click')

    expect(mockProps.onAccept).toHaveBeenCalled()
    expect(mockProps.onClose).toHaveBeenCalled()
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
  })

  it('calls mutation, handler and closes on Decline', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    const declineButton = wrapper.find(Button).at(0)
    expect(declineButton.text()).toEqual("I don't want more impact")
    declineButton.simulate('click')

    expect(mockProps.onDecline).toHaveBeenCalled()

    expect(mockProps.onClose).toHaveBeenCalled()
    expect(CreateSearchEnginePromptLogMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'SearchForACause',
      false
    )
  })

  it('default handlers do not throw', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()
    delete mockProps.onDecline
    delete mockProps.onAccept
    delete mockProps.onClose

    let wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    const declineButton = wrapper.find(Button).at(0)
    expect(() => declineButton.simulate('click')).not.toThrow()

    wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    const acceptButton = wrapper.find(Button).at(1)
    expect(() => acceptButton.simulate('click')).not.toThrow()
  })

  it('text adapts to hardSell prop', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()

    let wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      "You'll love having more impact."
    )

    const newProps = {
      ...mockProps,
      hardSell: false,
    }
    wrapper = mount(<SearchForACauseSellModal {...newProps} />)
    expect(wrapper.find(Typography).at(0).text()).toEqual(
      'Do even more good, for free'
    )
  })

  it('forwards open prop to Modal', () => {
    const SearchForACauseSellModal =
      require('src/components/SearchForACauseSellModal').default
    const mockProps = getMockProps()

    let wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    expect(wrapper.find(Modal).at(0).prop('open')).toEqual(true)

    mockProps.open = false
    wrapper = mount(<SearchForACauseSellModal {...mockProps} />)
    expect(wrapper.find(Modal).at(0).prop('open')).toEqual(false)
  })
})
