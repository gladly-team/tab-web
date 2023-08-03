import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, IconButton, Modal } from '@material-ui/core'
import { accountURL } from 'src/utils/urls'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
import { act } from 'react-dom/test-utils'
import UpdateWidgetDataMutation from 'src/utils/mutations/UpdateWidgetDataMutation'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import ShortcutIcon from '../ShortcutIcon'
import { goTo } from '../../utils/navigation'
import SearchInput from '../SearchInput'

const mockTestNanoId = 'a23456789'

jest.mock('src/utils/navigation')
jest.mock('src/utils/logger')
jest.mock('src/utils/mutations/UpdateWidgetDataMutation')
jest.mock('nanoid', () => ({ nanoid: () => mockTestNanoId }))

afterEach(() => {
  jest.clearAllMocks()
})

const getMockBookmarks = () => [
  {
    id: 'abcd',
    name: 'google',
    link: 'https://www.google.com',
  },
  {
    id: 'bcde',
    name: 'espn',
    link: 'https://www.espn.com',
  },
]
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
    widgets: {
      edges: [
        {
          node: {
            id: 'abcde',
            type: WIDGET_TYPE_BOOKMARKS,
            data: JSON.stringify({
              bookmarks: getMockBookmarks(),
            }),
          },
        },
      ],
    },
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

  it('does show shortcut icons with correct props', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)
    const shortcutIcons = wrapper.find(ShortcutIcon)

    expect(shortcutIcons.length).toEqual(2)

    const bookmarks = getMockBookmarks()
    for (let i = 0; i < bookmarks.length; i += 1) {
      expect(shortcutIcons.at(i).prop('id')).toEqual(bookmarks[i].id)
      expect(shortcutIcons.at(i).prop('text')).toEqual(bookmarks[i].name)
      expect(shortcutIcons.at(i).prop('url')).toEqual(bookmarks[i].link)
    }
  })

  it('does show not shortcut icons with correct props', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const props = {
      ...mockProps,
      user: {
        ...mockProps.user,
        widgets: {
          edges: [
            {
              node: {
                id: 'abcde',
                type: WIDGET_TYPE_BOOKMARKS,
                data: JSON.stringify({
                  bookmarks: [],
                }),
              },
            },
          ],
        },
      },
    }
    const wrapper = mount(<AddShortcutPage {...props} />)
    const shortcutIcons = wrapper.find(ShortcutIcon)

    expect(shortcutIcons.length).toEqual(0)
  })

  it('opens AddShortcut modal when AddShortcut icon is clicked', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)

    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toEqual(false)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(IconButton)
      .at(0)

    addShortcutButton.simulate('click')
    wrapper.update()

    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toEqual(true)
  })

  it('opens AddShortcut modal when Shortcut icon is clicked', () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)

    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toEqual(false)

    act(() => {
      wrapper.find(ShortcutIcon).at(0).prop('onEdit')()
    })
    wrapper.update()

    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toEqual(true)
  })

  it('adds bookmark flow works', async () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(IconButton)
      .at(0)

    addShortcutButton.simulate('click')
    wrapper.update()

    const addShortcutModal = wrapper
      .find('[data-test-id="add-shortcut-modal"]')
      .find(Modal)
      .first()
    addShortcutModal
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'test' } })
    addShortcutModal
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'http://www.test.com' } })
    addShortcutModal.find(Button).at(1).simulate('click')

    await flushAllPromises()
    expect(UpdateWidgetDataMutation).toHaveBeenCalledWith(
      mockProps.user,
      mockProps.user.widgets.edges[0].node,
      JSON.stringify({
        bookmarks: [
          ...getMockBookmarks(),
          {
            id: mockTestNanoId,
            name: 'test',
            link: 'http://www.test.com',
          },
        ],
      })
    )
    wrapper.update()
    expect(wrapper.find(ShortcutIcon).length).toEqual(3)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('edit bookmark flow works', async () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)
    const mockBookmarks = getMockBookmarks()

    wrapper.find(ShortcutIcon).at(0).find(IconButton).at(1).simulate('click')
    wrapper.update()

    const addShortcutModal = wrapper
      .find('[data-test-id="add-shortcut-modal"]')
      .find(Modal)
      .first()
    addShortcutModal
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'test' } })
    addShortcutModal
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'http://www.test.com' } })
    addShortcutModal.find(Button).at(1).simulate('click')

    await flushAllPromises()
    expect(UpdateWidgetDataMutation).toHaveBeenCalledWith(
      mockProps.user,
      mockProps.user.widgets.edges[0].node,
      JSON.stringify({
        bookmarks: [
          {
            id: mockBookmarks[0].id,
            name: 'test',
            link: 'http://www.test.com',
          },
          mockBookmarks[1],
        ],
      })
    )
    wrapper.update()
    expect(wrapper.find(ShortcutIcon).length).toEqual(2)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('delete bookmark flow works', async () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)
    const mockBookmarks = getMockBookmarks()

    wrapper.find(ShortcutIcon).at(0).find(IconButton).at(0).simulate('click')
    wrapper.update()

    await flushAllPromises()
    expect(UpdateWidgetDataMutation).toHaveBeenCalledWith(
      mockProps.user,
      mockProps.user.widgets.edges[0].node,
      JSON.stringify({
        bookmarks: [mockBookmarks[1]],
      })
    )

    wrapper.update()
    expect(wrapper.find(ShortcutIcon).length).toEqual(1)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('cancel add shortcut closes it', async () => {
    const AddShortcutPage = require('src/components/AddShortcutPage').default
    const mockProps = getMockProps()
    const wrapper = mount(<AddShortcutPage {...mockProps} />)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(IconButton)
      .at(0)

    addShortcutButton.simulate('click')
    wrapper.update()

    const addShortcutModal = wrapper
      .find('[data-test-id="add-shortcut-modal"]')
      .find(Modal)
      .first()
    addShortcutModal.find(Button).at(1).simulate('click')

    wrapper.update()
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })
})
