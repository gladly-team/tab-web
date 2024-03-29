/* globals document */

import React from 'react'
import { mount, shallow } from 'enzyme'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Button from '@material-ui/core/Button'
import { act } from 'react-dom/test-utils'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from '../DashboardPopover'

jest.mock('src/utils/mutations/SetUserSearchEngineMutation')

const getMockProps = () => ({
  anchorEl: document.createElement('button'),
  onClose: jest.fn(),
  userId: 'abcdefghijklmno',
  userSearchEngine: {
    name: 'Google',
    engineId: 'Google',
    inputPrompt: 'Search Google',
  },
  onMoreInfoClick: jest.fn(),
  open: true,
  searchEngines: {
    edges: [
      {
        node: {
          name: 'DuckDuckGo',
          engineId: 'DuckDuckGo',
          rank: 3,
          isCharitable: false,
          inputPrompt: 'Search DuckDuckGo',
        },
      },
      {
        node: {
          name: 'Google',
          engineId: 'Google',
          rank: 1,
          isCharitable: false,
          inputPrompt: 'Search Google',
        },
      },
      {
        node: {
          name: 'Ecosia',
          engineId: 'Ecosia',
          rank: 2,
          isCharitable: false,
          inputPrompt: 'Search Ecosia',
        },
      },
    ],
  },
  onSearchEngineSwitch: jest.fn(),
  yahooPaidSearchRewardOptIn: false,
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

  it('expect no "more info" button is rendered if no charitable search engines', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    expect(wrapper.find(Button)).toHaveLength(0)
  })

  it('renders engines in rank order', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)

    expect(wrapper.find(ToggleButton).first().find(Typography).text()).toEqual(
      'Google'
    )
    expect(wrapper.find(ToggleButton).at(1).find(Typography).text()).toEqual(
      'Ecosia'
    )
    expect(wrapper.find(ToggleButton).at(2).find(Typography).text()).toEqual(
      'DuckDuckGo'
    )
  })

  it('renders more info link in charitable engine button if has charitable engine and onMoreInfoClick is run on click', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    mockProps.searchEngines.edges.push({
      node: {
        name: 'Search for a Cause',
        engineId: 'SearchForACause',
        rank: 0,
        isCharitable: true,
        inputPrompt: 'Search for a Cause',
      },
    })
    const wrapper = mount(<SearchSelect {...mockProps} />)

    // assert clicking button calls onMoreInfoClick
    const charitableButton = wrapper.find(ToggleButton).first()
    charitableButton.simulate('click')
    expect(mockProps.onMoreInfoClick).toHaveBeenCalled()

    expect(mockProps.onSearchEngineSwitch).toHaveBeenCalledWith(
      'SearchForACause'
    )
  })

  it('renders impact badge in charitable engine button if opted in to impact search, and changes engine if clicked', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    mockProps.yahooPaidSearchRewardOptIn = true
    mockProps.searchEngines.edges.push({
      node: {
        name: 'Search for a Cause',
        engineId: 'SearchForACause',
        rank: 0,
        isCharitable: true,
        inputPrompt: 'Search for a Cause',
      },
    })
    const wrapper = mount(<SearchSelect {...mockProps} />)
    const charitableButton = wrapper.find(ToggleButton).first()
    expect(charitableButton.find(Typography).at(1).text()).toEqual('2x Impact')
    charitableButton.simulate('click')
    expect(mockProps.onSearchEngineSwitch).toHaveBeenCalledWith(
      'SearchForACause'
    )
  })

  it('expect that users search engine is changed on click of a toggle button, and executes onSearchEngineSwitch', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    const duckDuckGoButton = wrapper.find(ToggleButton).at(2)
    duckDuckGoButton.simulate('click')
    expect(mockProps.onSearchEngineSwitch).toHaveBeenCalledWith('DuckDuckGo')
  })

  it('expect that DashboardPopover onClose runs SearchSelect onClose', async () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    await act(async () => {
      wrapper.find(DashboardPopover).first().prop('onClose')()
    })
    wrapper.update()
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('default handlers do not throw', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    delete mockProps.onClose
    delete mockProps.onMoreInfoClick
    delete mockProps.onSearchEngineSwitch
    const wrapper = mount(<SearchSelect {...mockProps} />)

    // onMoreInfoClick does not throw
    expect(() => wrapper.prop('onMoreInfoClick')()).not.toThrow()

    // onClose does not throw
    expect(() => wrapper.prop('onClose')()).not.toThrow()

    // onSearchEngineSwitch does not throw
    expect(() => wrapper.prop('onSearchEngineSwitch')()).not.toThrow()
  })
})
