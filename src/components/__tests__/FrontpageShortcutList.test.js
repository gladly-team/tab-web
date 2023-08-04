import React from 'react'
import { mount, shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import { Modal, IconButton } from '@material-ui/core'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import UpdateWidgetDataMutation from 'src/utils/mutations/UpdateWidgetDataMutation'
import { act } from 'react-dom/test-utils'
import ShortcutIcon from '../ShortcutIcon'

const mockTestNanoId = 'a23456789'

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
  {
    id: 'cdef',
    name: 'google2',
    link: 'https://www.google2.com',
  },
  {
    id: 'defg',
    name: 'espn2',
    link: 'https://www.espn2.com',
  },
  {
    id: 'efgh',
    name: 'google3',
    link: 'https://www.google.com',
  },
  {
    id: 'fghi',
    name: 'espn3',
    link: 'https://www.espn.com',
  },
  {
    id: 'ghij',
    name: 'google4',
    link: 'https://www.google2.com',
  },
]
const getMockProps = () => ({
  userId: 'userId',
  user: {
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
  openHandler: jest.fn(),
})

describe('FrontpageShortcutList component', () => {
  it('renders without error', () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<FrontpageShortcutList {...mockProps} />)
    }).not.toThrow()
  })

  it('displays up to four icons for links', () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = shallow(<FrontpageShortcutList {...mockProps} />)
    const bookmarks = getMockBookmarks()

    const shortcutIcons = wrapper.find(ShortcutIcon)

    expect(shortcutIcons.length).toEqual(4)
    for (let i = 0; i < 4; i += 1) {
      const shortcutIcon = shortcutIcons.at(i)
      expect(shortcutIcon.prop('text')).toEqual(bookmarks[i + 3].name)
      expect(shortcutIcon.prop('url')).toEqual(bookmarks[i + 3].link)
    }
  })

  it('calls open handler button click', () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = shallow(<FrontpageShortcutList {...mockProps} />)

    wrapper.find(IconButton).simulate('click')
    wrapper.update()

    expect(mockProps.openHandler).toHaveBeenCalled()
  })

  it('opens AddShortcut modal when AddShortcut icon is clicked', () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)

    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toEqual(false)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(Button)
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
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)

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
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(Button)
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
    expect(wrapper.find(ShortcutIcon).length).toEqual(4)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('edit bookmark flow works', async () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)
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
    mockBookmarks.splice(3, 1, {
      id: mockBookmarks[3].id,
      name: 'test',
      link: 'http://www.test.com',
    })
    expect(UpdateWidgetDataMutation).toHaveBeenCalledWith(
      mockProps.user,
      mockProps.user.widgets.edges[0].node,
      JSON.stringify({
        bookmarks: mockBookmarks,
      })
    )
    wrapper.update()
    expect(wrapper.find(ShortcutIcon).length).toEqual(4)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('delete bookmark flow works', async () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)
    const mockBookmarks = getMockBookmarks()

    wrapper.find(ShortcutIcon).at(0).find(IconButton).at(0).simulate('click')
    wrapper.update()

    await flushAllPromises()
    mockBookmarks.splice(3, 1)
    expect(UpdateWidgetDataMutation).toHaveBeenCalledWith(
      mockProps.user,
      mockProps.user.widgets.edges[0].node,
      JSON.stringify({
        bookmarks: mockBookmarks,
      })
    )

    wrapper.update()
    expect(wrapper.find(ShortcutIcon).length).toEqual(4)
    expect(
      wrapper
        .find('[data-test-id="add-shortcut-modal"]')
        .find(Modal)
        .first()
        .prop('open')
    ).toBe(false)
  })

  it('cancel add shortcut closes it', async () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)

    const addShortcutButton = wrapper
      .find('[data-test-id="add-shortcut"]')
      .find(Button)
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
