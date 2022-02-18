/* globals document */

import React from 'react'
import { mount, shallow } from 'enzyme'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Button from '@material-ui/core/Button'
import { act } from 'react-dom/test-utils'
import DashboardPopover from '../DashboardPopover'

jest.mock('src/utils/mutations/SetUserSearchEngineMutation')

const getMockProps = () => ({
  anchorEl: document.createElement('button'),
  onClose: jest.fn(),
  userId: 'abcdefghijklmno',
  userSearchEngine: 'Google',
  onMoreInfoClick: jest.fn(),
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SearchSelect', () => {
  it('renders without error', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchSelect {...mockProps} />)
    }).not.toThrow()
  })

  it('expect that onMoreInfoClick is run on link click', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    const getMoreInfoButton = wrapper.find(Button).first()
    getMoreInfoButton.simulate('click')

    expect(mockProps.onMoreInfoClick).toHaveBeenCalled()
  })

  it('expect that users search engine is changed on click of a toggle button', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    const duckDuckGoButton = wrapper.find(ToggleButton).at(3)
    duckDuckGoButton.simulate('click')

    expect(SetUserSearchEngineMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'DuckDuckGo'
    )
  })

  it('expect that DashboardPopover onClose sets open to close and runs SearchSelect onClose', async () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    await act(async () => {
      wrapper.find(DashboardPopover).first().prop('onClose')()
    })
    wrapper.update()
    expect(mockProps.onClose).toHaveBeenCalled()
    expect(wrapper.find(DashboardPopover).first().prop('open')).toEqual(false)
  })

  it('default handlers for onClose and onMoreInfoClick do not throw', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    delete mockProps.onClose
    delete mockProps.onMoreInfoClick
    const wrapper = mount(<SearchSelect {...mockProps} />)

    // onMoreInfoClick does not throw
    expect(() => wrapper.prop('onMoreInfoClick')()).not.toThrow()

    // onClose does not throw
    expect(() => wrapper.prop('onClose')()).not.toThrow()
  })
})
