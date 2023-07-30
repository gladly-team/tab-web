import React from 'react'
import { mount, shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import ShortcutIcon from '../ShortcutIcon'

const getMockProps = () => ({
  bookmarks: [
    {
      name: 'google',
      link: 'https://www.google.com',
    },
    {
      name: 'espn',
      link: 'https://www.espn.com',
    },
    {
      name: 'google2',
      link: 'https://www.google2.com',
    },
    {
      name: 'espn2',
      link: 'https://www.espn2.com',
    },
    {
      name: 'google3',
      link: 'https://www.google3.com',
    },
    {
      name: 'espn3',
      link: 'https://www.espn3.com',
    },
  ],
  addShortcutClick: jest.fn(),
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

    const shortcutIcons = wrapper.find(ShortcutIcon)

    expect(shortcutIcons.length).toEqual(4)
    for (let i = 0; i < 4; i += 1) {
      const shortcutIcon = shortcutIcons.at(i)
      expect(shortcutIcon.prop('text')).toEqual(mockProps.bookmarks[i + 2].name)
      expect(shortcutIcon.prop('url')).toEqual(mockProps.bookmarks[i + 2].link)
    }
  })

  it('calls add shortcut handler on button click', () => {
    const FrontpageShortcutList =
      require('src/components/FrontpageShortcutList').default
    const mockProps = getMockProps()
    const wrapper = mount(<FrontpageShortcutList {...mockProps} />)

    const button = wrapper.find(Button).first()
    button.simulate('click')

    expect(mockProps.addShortcutClick).toHaveBeenCalled()
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
})
