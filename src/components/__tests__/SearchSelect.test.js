/* globals document */

import React from 'react'
import { mount, shallow } from 'enzyme'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
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
    searchUrl: 'https://www.google.com/search?q={searchTerms}',
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
          searchUrl: 'https://duckduckgo.com/?q={searchTerms}',
          rank: 3,
          isCharitable: false,
          inputPrompt: 'Search DuckDuckGo',
        },
      },
      {
        node: {
          name: 'Google',
          engineId: 'Google',
          searchUrl: 'https://www.google.com/search?q={searchTerms}',
          rank: 1,
          isCharitable: false,
          inputPrompt: 'Search Google',
        },
      },
      {
        node: {
          name: 'Ecosia',
          engineId: 'Ecosia',
          searchUrl: 'https://www.ecosia.org/search?q={searchTerms}',
          rank: 2,
          isCharitable: false,
          inputPrompt: 'Search Ecosia',
        },
      },
    ],
  },
  onSearchEngineSwitch: jest.fn(),
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

  it('renders button if has charitable engine and onMoreInfoClick is run on link click', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    mockProps.searchEngines.edges.push({
      node: {
        name: 'Search for a Cause',
        engineId: 'SearchForACause',
        searchUrl: 'http://tab.gladly.io/search/v2?q={searchTerms}',
        rank: 0,
        isCharitable: true,
        inputPrompt: 'Search for a Cause',
      },
    })
    const wrapper = mount(<SearchSelect {...mockProps} />)

    // assert clicking button calls onMoreInfoClick
    const buttons = wrapper.find(Button)
    expect(buttons).toHaveLength(1)
    const getMoreInfoButton = buttons.first()
    getMoreInfoButton.simulate('click')
    expect(mockProps.onMoreInfoClick).toHaveBeenCalled()
  })

  it('renders more info link after charitable engine', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    mockProps.searchEngines.edges.push({
      node: {
        name: 'Search for a Cause',
        engineId: 'SearchForACause',
        searchUrl: 'http://tab.gladly.io/search/v2?q={searchTerms}',
        rank: 0,
        isCharitable: true,
        inputPrompt: 'Search for a Cause',
      },
    })
    const wrapper = shallow(<SearchSelect {...mockProps} />)

    // assert more info is displayed after
    const toggleButtonGroupChildren = wrapper
      .find(ToggleButtonGroup)
      .first()
      .children()
    expect(
      toggleButtonGroupChildren.at(1).find(Typography).first().text()
    ).toContain('Earn More Impact')
  })

  it('expect that users search engine is changed on click of a toggle button, and executes onSearchEngineSwitch', () => {
    const SearchSelect = require('src/components/SearchSelect').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchSelect {...mockProps} />)
    const duckDuckGoButton = wrapper.find(ToggleButton).at(2)
    duckDuckGoButton.simulate('click')

    expect(SetUserSearchEngineMutation).toHaveBeenCalledWith(
      mockProps.userId,
      'DuckDuckGo'
    )
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
