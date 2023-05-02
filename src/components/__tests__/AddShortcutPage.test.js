import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button } from '@material-ui/core'
import { accountURL } from 'src/utils/urls'
import SearchInput from '../SearchInput'
import { goTo } from '../../utils/navigation'

jest.mock('src/utils/navigation')
jest.mock('src/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  app: {
    searchEngines: {
      edges: [
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
            name: 'DuckDuckGo',
            engineId: 'DuckDuckGo',
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
      searchUrlPersonalized: 'https://www.google.com/search?q={searchTerms}',
      inputPrompt: 'Search Google',
    },
    yahooPaidSearchRewardOptIn: true,
  },
  closeHandler: jest.fn(),
})

describe('AddShortcutPage component', () => {
  it('renders without error', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AddShortcutPage {...mockProps} />)
    }).not.toThrow()
  })

  it('renders a SearchInput with appropriate props', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)
    expect(wrapper.find(SearchInput).exists()).toEqual(true)

    const searchInput = wrapper.find(SearchInput).first()
    expect(searchInput.prop('app')).toEqual(mockProps.app)
    expect(searchInput.prop('user')).toEqual(mockProps.user)
    expect(searchInput.prop('userId')).toEqual(mockProps.userId)
  })

  it('goes to settings page when button is clicked', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)
    const buttons = wrapper.find(Button)

    buttons.at(0).simulate('click')
    expect(goTo).toHaveBeenCalledWith(accountURL)
  })

  // TODO: @jedtan Add test for close and down buttons.
})
