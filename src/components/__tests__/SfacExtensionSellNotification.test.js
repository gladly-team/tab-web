import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import CreateSfacExtensionPromptResponseMutation from 'src/utils/mutations/CreateSfacExtensionPromptResponseMutation'
import { windowOpenTop } from 'src/utils/navigation'
import { GET_SEARCH_URL } from 'src/utils/urls'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import logger from 'src/utils/logger'
import Notification from '../Notification'

jest.mock('src/utils/navigation')
jest.mock('src/utils/logger')
jest.mock('src/utils/mutations/CreateSfacExtensionPromptResponseMutation')

beforeAll(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  browser: 'chrome',
})

describe('SfacExtensionSellNotification component', () => {
  it('renders without error', () => {
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SfacExtensionSellNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('calls mutation, calls handler and closes on clicking no', () => {
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual('Maybe later')
    acceptButton.simulate('click')

    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      false
    )
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('calls mutation and redirect on clicking yes', async () => {
    expect.assertions(6)
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's do it!")

    CreateSfacExtensionPromptResponseMutation.mockResolvedValue({})

    await act(async () => {
      acceptButton.simulate('click')

      await flushAllPromises()
      jest.runAllTimers()
      await flushAllPromises()
    })

    wrapper.update()
    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      true
    )
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
    expect(windowOpenTop).toHaveBeenCalledWith(GET_SEARCH_URL)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('calls a redirect to the search engine result page (and does not throw or log) if CreateSfacExtensionPromptResponseMutation throws an error', async () => {
    expect.assertions(6)
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's do it!")

    CreateSfacExtensionPromptResponseMutation.mockRejectedValue(
      new Error('Uh oh.')
    )

    await act(async () => {
      acceptButton.simulate('click')

      await flushAllPromises()
      jest.runAllTimers()
      await flushAllPromises()
    })

    wrapper.update()
    expect(CreateSfacExtensionPromptResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'chrome',
      true
    )
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
    expect(windowOpenTop).toHaveBeenCalledWith(GET_SEARCH_URL)
    expect(logger.error).toHaveBeenCalledWith(new Error('Uh oh.'))
  })
})
