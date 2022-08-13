import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import Notification from '../Notification'

jest.mock('src/utils/mutations/SetYahooSearchOptInMutation')
jest.mock('src/utils/mutations/CreateSearchEnginePromptLogMutation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  onNo: jest.fn(),
  onYes: jest.fn(),
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

  it('calls handler and closes on clicking no', () => {
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual('Maybe later')
    acceptButton.simulate('click')

    expect(mockProps.onNo).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('calls mutation, handler and closes on clicking yes', () => {
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's do it!")
    acceptButton.simulate('click')

    expect(mockProps.onYes).toHaveBeenCalled()
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('default handlers do not throw', () => {
    const SfacExtensionSellNotification =
      require('src/components/SfacExtensionSellNotification').default
    const mockProps = getMockProps()
    delete mockProps.onNo
    delete mockProps.onYes

    let wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    const onNoButton = wrapper.find(Button).at(0)
    expect(() => onNoButton.simulate('click')).not.toThrow()

    wrapper = mount(<SfacExtensionSellNotification {...mockProps} />)
    const onYesButton = wrapper.find(Button).at(1)
    expect(() => onYesButton.simulate('click')).not.toThrow()
  })
})
