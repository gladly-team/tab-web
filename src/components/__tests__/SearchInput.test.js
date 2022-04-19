import React from 'react'
import { mount, shallow } from 'enzyme'
import LogSearchMutation from 'src/utils/mutations/LogSearchMutation'
import Input from '@material-ui/core/Input'
import { IconButton } from '@material-ui/core'
import { act } from 'react-dom/test-utils'
import { windowOpenTop } from 'src/utils/navigation'
import Tooltip from '@material-ui/core/Tooltip'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import logger from 'src/utils/logger'
import SearchSelect from '../SearchSelect'

jest.mock('src/utils/mutations/LogSearchMutation')
jest.mock('src/utils/navigation')
jest.mock('src/utils/logger')

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  app: {
    searchEngines: {
      edges: [
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
            name: 'DuckDuckGo',
            engineId: 'DuckDuckGo',
            searchUrl: 'https://duckduckgo.com/?q={searchTerms}',
            rank: 3,
            isCharitable: false,
            inputPrompt: 'Search DuckDuckGo',
          },
        },
      ],
    },
  },
  user: {
    searchEngine: {
      name: 'Google',
      engineId: 'Google',
      searchUrl: 'https://www.google.com/search?q={searchTerms}',
      inputPrompt: 'Search Google',
    },
    yahooPaidSearchRewardOptIn: true,
  },
  tooltip: true,
  onSearchSelectMoreInfoClick: jest.fn(),
  onSearchEngineSwitch: jest.fn(),
})

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  LogSearchMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchInput component', () => {
  it('renders without error', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SearchInput {...mockProps} />)
    }).not.toThrow()
  })

  it('opens SearchInput clicking the InputAdornment, and closing makes SearchInput invisible', async () => {
    expect.assertions(3)
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)
    expect(wrapper.find(SearchSelect).first().prop('open')).toEqual(false)

    wrapper.find(IconButton).at(1).simulate('click')

    expect(wrapper.find(SearchSelect).first().prop('open')).toEqual(true)

    act(() => {
      wrapper.find(SearchSelect).first().prop('onClose')()
    })
    wrapper.update()

    expect(wrapper.find(SearchSelect).first().prop('open')).toEqual(false)
  })

  it('onSearchEngineSwitch passed to SearchInput changes the search engine result page', async () => {
    expect.assertions(2)
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)

    act(() => {
      wrapper.find(SearchSelect).first().prop('onSearchEngineSwitch')(
        'DuckDuckGo'
      )
    })
    wrapper.update()

    expect(wrapper.find(Input).first().prop('placeholder')).toEqual(
      'Search DuckDuckGo'
    )
    const searchTextField = wrapper.find(Input)
    searchTextField
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    searchTextField.find('input').simulate('keypress', { key: 'Enter' })

    await flushAllPromises()
    expect(windowOpenTop).toHaveBeenCalledWith('https://duckduckgo.com/?q=')
  })

  it('calls LogTab mutation onSearch', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)
    const searchTextField = wrapper.find(Input)
    searchTextField
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    searchTextField.find('input').simulate('keypress', { key: 'Enter' })
    expect(LogSearchMutation).toHaveBeenCalledWith({
      userIdGlobal: mockProps.userId,
      source: 'tab',
    })
  })

  it('calls a redirect to the search engine result page (and does not throw or log) if LogTabMutation takes a really long time to resolve', async () => {
    expect.assertions(2)
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)
    LogSearchMutation.mockReturnValueOnce(new Promise(() => {})) // unresolved request
    const searchTextField = wrapper.find(Input)
    searchTextField
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    searchTextField.find('input').simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    jest.runAllTimers()
    await flushAllPromises()
    expect(windowOpenTop).toHaveBeenCalledWith(
      'https://www.google.com/search?q='
    )
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('calls a redirect to the search engine result page (and logs but does not throw) if LogTabMutation rejects', async () => {
    expect.assertions(2)
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)
    LogSearchMutation.mockRejectedValue(new Error('Uh oh.'))
    const searchTextField = wrapper.find(Input)
    searchTextField
      .find('input')
      .simulate('change', { target: { value: 'test' } })
    searchTextField.find('input').simulate('keypress', { key: 'Enter' })
    await flushAllPromises()
    jest.runAllTimers()
    await flushAllPromises()
    expect(windowOpenTop).toHaveBeenCalledWith(
      'https://www.google.com/search?q='
    )
    expect(logger.error).toHaveBeenCalledWith(new Error('Uh oh.'))
  })

  it('tooltip icon button closes tooltip', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)

    expect(wrapper.find(Tooltip).first().prop('open')).toEqual(true)

    wrapper.find(Tooltip).first().find(IconButton).at(1).simulate('click')

    expect(wrapper.find(Tooltip).first().prop('open')).toEqual(false)
  })

  it('forwards props to SearchInput element', () => {
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    const wrapper = mount(<SearchInput {...mockProps} />)

    const searchSelect = wrapper.find(SearchSelect).first()
    expect(searchSelect.prop('userSearchEngine')).toEqual(
      mockProps.user.searchEngine
    )
    expect(searchSelect.prop('userId')).toEqual(mockProps.userId)
    expect(searchSelect.prop('searchEngines')).toEqual(
      mockProps.app.searchEngines
    )
    expect(searchSelect.prop('yahooPaidSearchRewardOptIn')).toEqual(
      mockProps.user.yahooPaidSearchRewardOptIn
    )
  })

  it('expect default onSearchSelectMoreInfoClick not to throw', async () => {
    expect.assertions(1)
    const SearchInput = require('src/components/SearchInput').default
    const mockProps = getMockProps()
    delete mockProps.onSearchSelectMoreInfoClick
    const wrapper = mount(<SearchInput {...mockProps} />)

    const searchSelect = wrapper.find(SearchSelect).first()
    expect(() => searchSelect.prop('onMoreInfoClick')()).not.toThrow()
  })
})
