import React from 'react'
import { mount } from 'enzyme'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import CreateInvitedUsersMutation from 'src/utils/mutations/CreateInvitedUsersMutation'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import { act } from 'react-dom/test-utils'
import SocialShare from 'src/components/SocialShare'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import IconButton from '@material-ui/core/IconButton'
import { media } from 'src/utils/urls'

jest.mock('src/utils/constants', () => ({
  MEDIA_ENDPOINT: 'https://dev-tab2017-media.gladly.io',
}))
const getMockProps = () => ({
  username: 'someUsername',
  userId: 'someId',
  landingPagePath: '/cats/',
  closeFunction: jest.fn(),
  user: {
    cause: {
      sharing: {
        shareImage: 'cats/shareCats.png',
        sentImage: 'cats/catsSent.png',
        title: 'Share Tab for Cats with your friends',
        subtitle:
          "Save more cats! When a friend signs up, you'll each earn 5 additional treats to help a shelter cat get adopted. 😺",
      },
    },
  },
})

const otherUsers = [
  {
    user: {
      cause: {
        sharing: {
          shareImage: 'cats/shareCats.png',
          sentImage: 'cats/catsSent.png',
          title: 'Share Tab for Cats with your friends',
          subtitle:
            "Save more cats! When a friend signs up, you'll each earn 5 additional treats to help a shelter cat get adopted. 😺",
        },
      },
    },
    expectedImage: 'cats/shareCats.png',
    expectedAfterImage: 'cats/catsSent.png',
  },
  {
    user: {
      cause: {
        sharing: {
          shareImage: 'seas/seasEmailInvite.svg',
          sentImage: 'seas/seasEmailInvite.svg',
          title: 'Seas',
          subtitle: 'Seas',
        },
      },
    },
    expectedImage: 'seas/seasEmailInvite.svg',
    expectedAfterImage: 'seas/seasEmailInvite.svg',
  },
]

jest.mock('src/utils/mutations/CreateInvitedUsersMutation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('EmailInviteDialog component', () => {
  it('renders without error', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <EmailInviteFriendsDialog {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('displays correct image by default', () => {
    otherUsers.forEach((testUser) => {
      const EmailInviteFriendsDialog =
        require('src/components/EmailInviteDialog').default
      const mockProps = {
        ...getMockProps(),
        user: testUser.user,
      }
      const wrapper = mount(
        <ThemeProvider theme={theme}>
          <EmailInviteFriendsDialog {...mockProps} />
        </ThemeProvider>
      )
      expect(wrapper.find('img').at(0).prop('src')).toBe(
        media(testUser.expectedImage)
      )
    })
  })

  it('the send email button is disabled by default', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()

    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
    expect(wrapper.find(Button).prop('variant')).toBe('contained')
  })

  it('the close button calls the onclose function', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()

    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    wrapper.find(IconButton).at(0).simulate('click')
    wrapper.update()
    expect(mockProps.closeFunction).toHaveBeenCalled()
  })

  it('there is no default message', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()

    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('')
  })

  it('successfully adds a valid email', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'test@gmail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('test@gmail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('')
    expect(wrapper.find(Chip).at(0).prop('label')).toBe('test@gmail.com')
  })

  it('successfully removes a valid email chip', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'test@gmail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('test@gmail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('')
    expect(wrapper.find(Chip).at(0).prop('label')).toBe('test@gmail.com')

    await act(async () => {
      wrapper.find(Chip).at(0).prop('onDelete')()
      wrapper.update()
    })
    wrapper.update()
    expect(wrapper.find(Chip).exists()).toBe(false)
  })

  it('enables send button if there is atleast one valid email and a name', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'test@gmail.com' } })
    emailInput.find('input').simulate('blur')
    const nameInput = wrapper.find(TextField).at(1)
    nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
    nameInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(Button).prop('disabled')).toBe(false)
  })

  it('shows an error message if user tries to add an invalid email', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsfgail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('testdsfgail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(0).props().error).toBe(true)
    expect(wrapper.find(TextField).at(0).props().helperText).toBe(
      'Oops.  It looks like this email address is incorrect!'
    )
  })

  it('removes the error message if user fixes an incorrect email', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsfgail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('testdsfgail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(0).props().error).toBe(true)
    expect(wrapper.find(TextField).at(0).props().helperText).toBe(
      'Oops.  It looks like this email address is incorrect!'
    )
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(0).props().error).toBe(false)
  })

  it('calls the create invited users mutation with email, name and message', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    wrapper.update()
    const nameInput = wrapper.find(TextField).at(1)
    nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
    nameInput.find('input').simulate('blur')
    wrapper.update()
    const messageInput = wrapper.find(TextField).at(2)
    messageInput
      .find('textarea')
      .simulate('change', { target: { value: 'this is a message' } })
    messageInput.find('textarea').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    await act(async () => {
      await flushAllPromises()
    })
    expect(CreateInvitedUsersMutation).toHaveBeenCalledWith(
      'someId',
      ['testdsf@gmail.com'],
      'yolo',
      'this is a message'
    )
  })

  it('shows an error and disables send button if message is too long', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    wrapper.update()
    const messageInput = wrapper.find(TextField).at(2)
    messageInput.find('textarea').simulate('change', {
      target: {
        value:
          'this is a message that is way too long this is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too long',
      },
    })
    messageInput.find('textarea').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    await act(async () => {
      await flushAllPromises()
    })

    expect(CreateInvitedUsersMutation).not.toHaveBeenCalled()
    expect(wrapper.find(TextField).at(2).props().error).toBe(true)
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      'The max length of the personal message is 160 characters.'
    )
  })

  it('removes error message and successfully sends email invites when message is shortened', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    const nameInput = wrapper.find(TextField).at(1)
    nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
    nameInput.find('input').simulate('blur')
    wrapper.update()
    const messageInput = wrapper.find(TextField).at(2)
    messageInput.find('textarea').simulate('change', {
      target: {
        value:
          'this is a message that is way too long this is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too longthis is a message that is way too long',
      },
    })
    messageInput.find('textarea').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    await act(async () => {
      await flushAllPromises()
    })

    expect(CreateInvitedUsersMutation).not.toHaveBeenCalled()

    messageInput.find('textarea').simulate('change', {
      target: {
        value: 'this is a normal message',
      },
    })
    messageInput.find('textarea').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    await act(async () => {
      await flushAllPromises()
    })

    expect(CreateInvitedUsersMutation).toHaveBeenCalled()
    expect(wrapper.find(TextField).at(2).props().error).toBe(false)
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      'Let your friend know why they should join.'
    )
  })

  it('shows the successful send state when emails are successfully sent', async () => {
    for (let i = 0; i < otherUsers.length; i += 1) {
      const testUser = otherUsers[i]
      const EmailInviteFriendsDialog =
        require('src/components/EmailInviteDialog').default
      const mockProps = {
        ...getMockProps(),
        user: testUser.user,
      }
      const wrapper = mount(
        <ThemeProvider theme={theme}>
          <EmailInviteFriendsDialog {...mockProps} />
        </ThemeProvider>
      )
      const emailInput = wrapper.find(TextField).at(0)
      emailInput
        .find('input')
        .simulate('change', { target: { value: 'testdsf@gmail.com' } })
      wrapper.update()
      emailInput.find('input').simulate('blur')
      const nameInput = wrapper.find(TextField).at(1)
      nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
      nameInput.find('input').simulate('blur')
      wrapper.update()
      wrapper.find(Button).simulate('click')
      wrapper.update()
      /* eslint-disable no-await-in-loop */
      await act(async () => {
        await flushAllPromises()
        wrapper.update()
      })
      /* eslint-disable no-await-in-loop */
      expect(wrapper.find('img').at(1).prop('alt')).toBe(
        `${testUser.user.cause.sharing.sentImage}`
      )
      expect(wrapper.find('img').at(1).prop('src')).toBe(
        media(testUser.expectedAfterImage)
      )
    }
  })

  it('resets the send email state after emails have successfully sent', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(0)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    wrapper.update()
    await act(async () => {
      await flushAllPromises()
      await new Promise((r) => setTimeout(r, 2500))
      wrapper.update()
    })
    expect(wrapper.find(TextField).at(0).prop('value')).toBe('')
  })
})
describe('social share component', () => {
  it('shows social share when user clicks on subnav and has correct link', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=someUsername'
    )
  })

  it('contains the correct referral URL, using tab.gladly.io by default', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    mockProps.username = 'bob'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=bob'
    )
  })

  it('contains the correct referral URL, using tab.gladly.io by default and /teamseas/ landing page path', async () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    mockProps.username = 'bob'
    mockProps.landingPagePath = '/teamseas/'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/teamseas/?u=bob'
    )
  })

  it('encodes the referral URL correctly when the username contains a space', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    mockProps.username = 'Bugs Bunny'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Bugs%20Bunny'
    )
  })

  it('encodes the referral URL correctly when the username contains a plus sign', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    mockProps.username = 'my+username'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=my%2Busername'
    )
  })

  it('encodes the referral URL correctly when the username contains an emoji', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    mockProps.username = 'Stinky💩'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    wrapper.update()
    expect(wrapper.find(TextField).at(3).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Stinky%F0%9F%92%A9'
    )
  })

  it('renders social share', () => {
    const EmailInviteFriendsDialog =
      require('src/components/EmailInviteDialog').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <EmailInviteFriendsDialog {...mockProps} />
      </ThemeProvider>
    )
    const subNav = wrapper.findWhere(
      (n) => n.prop('id') === 'simple-tabpanel-1'
    )
    subNav.simulate('click')
    wrapper.update()
    expect(wrapper.find(SocialShare).length).toEqual(1)
  })
})
