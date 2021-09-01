import React from 'react'
import { mount } from 'enzyme'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import CreateSquadInvitesMutation from 'src/utils/mutations/CreateSquadInvitesMutation'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import Fade from '@material-ui/core/Fade'

jest.mock('src/utils/mutations/CreateSquadInvitesMutation')
jest.mock('src/utils/logger')
const getMockProps = () => ({
  user: {
    username: 'someUsername',
    id: 'someId',
  },
  missionId: '123456789',
  emailSentCallback: jest.fn(),
})
jest.mock('src/utils/mutations/CreateSquadInvitesMutation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('EmailInviteDialog component', () => {
  it('renders without error', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <MissionSocialShare {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('the send email button is disabled by default', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()

    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
    expect(wrapper.find(Button).prop('variant')).toBe('contained')
  })

  it('there is no default message', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()

    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('')
  })

  it('successfully adds a valid email', async () => {
    expect.assertions(3)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'test@gmail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('test@gmail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('')
    expect(wrapper.find(Chip).at(0).prop('label')).toBe('test@gmail.com')
  })

  it('shows an error if a user tries to add more than 20 emails', async () => {
    expect.assertions(2)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    let i = 20
    while (i > 0) {
      emailInput
        .find('input')
        .simulate('change', { target: { value: `${i}test@gmail.com` } })
      wrapper.update()
      act(() => {
        emailInput.find('input').simulate('blur')
      })

      wrapper.update()
      i -= 1
    }
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      'You can send 20 emails at a time.'
    )
    await act(async () => {
      wrapper.find(Chip).at(0).prop('onDelete')()
    })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      "Add your friend's email."
    )
  })

  it('successfully removes a valid email chip', async () => {
    expect.assertions(4)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'test@gmail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('test@gmail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('')
    expect(wrapper.find(Chip).at(0).prop('label')).toBe('test@gmail.com')

    await act(async () => {
      wrapper.find(Chip).at(0).prop('onDelete')()
      wrapper.update()
    })
    wrapper.update()
    expect(wrapper.find(Chip).exists()).toBe(false)
  })

  it('enables send button if there is atleast one valid email and a name', async () => {
    expect.assertions(2)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
    const emailInput = wrapper.find(TextField).at(2)
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
    expect.assertions(3)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsfgail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('testdsfgail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(2).props().error).toBe(true)
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      'Oops.  It looks like this email address is incorrect!'
    )
  })

  it('removes the error message if user fixes an incorrect email', async () => {
    expect.assertions(4)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsfgail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('testdsfgail.com')
    emailInput.find('input').simulate('blur')
    wrapper.update()
    expect(wrapper.find(TextField).at(2).props().error).toBe(true)
    expect(wrapper.find(TextField).at(2).props().helperText).toBe(
      'Oops.  It looks like this email address is incorrect!'
    )
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gail.com' } })
    wrapper.update()
    expect(wrapper.find(TextField).at(2).props().error).toBe(false)
  })

  it('calls the create invited users mutation with email, name and message', async () => {
    expect.assertions(1)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
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
    const messageInput = wrapper.find(TextField).at(3)
    messageInput
      .find('textarea')
      .simulate('change', { target: { value: 'this is a message' } })
    messageInput.find('textarea').simulate('blur')
    wrapper.update()
    wrapper.find(Button).simulate('click')
    await act(async () => {
      await flushAllPromises()
    })
    expect(CreateSquadInvitesMutation).toHaveBeenCalledWith(
      'someId',
      ['testdsf@gmail.com'],
      'yolo',
      'this is a message'
    )
  })

  it('shows an error and disables send button if message is too long', async () => {
    expect.assertions(3)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    wrapper.update()
    const messageInput = wrapper.find(TextField).at(3)
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

    expect(CreateSquadInvitesMutation).not.toHaveBeenCalled()
    expect(wrapper.find(TextField).at(3).props().error).toBe(true)
    expect(wrapper.find(TextField).at(3).props().helperText).toBe(
      'The max length of the personal message is 160 characters.'
    )
  })

  it('removes error message and successfully sends email invites when message is shortened', async () => {
    expect.assertions(4)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
    emailInput
      .find('input')
      .simulate('change', { target: { value: 'testdsf@gmail.com' } })
    wrapper.update()
    emailInput.find('input').simulate('blur')
    const nameInput = wrapper.find(TextField).at(1)
    nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
    nameInput.find('input').simulate('blur')
    wrapper.update()
    const messageInput = wrapper.find(TextField).at(3)
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

    expect(CreateSquadInvitesMutation).not.toHaveBeenCalled()

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

    expect(CreateSquadInvitesMutation).toHaveBeenCalled()
    expect(wrapper.find(TextField).at(3).props().error).toBe(false)
    expect(wrapper.find(TextField).at(3).props().helperText).toBe(
      'Let your friend know why they should join.'
    )
  })

  it('shows the successful send state when emails are successfully sent', async () => {
    expect.assertions(1)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
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
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    expect(wrapper.find(Fade).exists()).toBe(true)
  })

  it('resets the send email state after emails have successfully sent', async () => {
    expect.assertions(1)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    const emailInput = wrapper.find(TextField).at(2)
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
    wrapper.find(Button).simulate('click')
    wrapper.update()
    await act(async () => {
      await flushAllPromises()
      await new Promise((r) => setTimeout(r, 2500))
      wrapper.update()
    })
    expect(wrapper.find(TextField).at(2).prop('value')).toBe('')
  })
})
it('fires the callback when emails are sent', async () => {
  expect.assertions(1)
  const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
    .default
  const mockProps = getMockProps()
  CreateSquadInvitesMutation.mockReturnValue({
    createSquadInvites: { currentMission: { squadId: 'someSquadId' } },
  })
  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <MissionSocialShare {...mockProps} />
    </ThemeProvider>
  )
  const emailInput = wrapper.find(TextField).at(2)
  emailInput
    .find('input')
    .simulate('change', { target: { value: 'testdsf@gmail.com' } })
  wrapper.update()
  emailInput.find('input').simulate('blur')
  const nameInput = wrapper.find(TextField).at(1)
  nameInput.find('input').simulate('change', { target: { value: 'yolo' } })
  nameInput.find('input').simulate('blur')
  wrapper.update()
  wrapper.update()
  wrapper.find(Button).simulate('click')
  wrapper.update()
  await act(async () => {
    await flushAllPromises()
    await new Promise((r) => setTimeout(r, 2500))
    wrapper.update()
  })
  expect(mockProps.emailSentCallback).toHaveBeenCalled()
})
describe('social share component', () => {
  it('shows the correct link', async () => {
    expect.assertions(1)
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(0).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=someUsername&m=123456789'
    )
  })

  it('encodes the referral URL correctly when the username contains a space', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    mockProps.user.username = 'Bugs Bunny'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(0).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Bugs%20Bunny&m=123456789'
    )
  })

  it('encodes the referral URL correctly when the username contains a plus sign', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    mockProps.user.username = 'my+username'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(0).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=my%2Busername&m=123456789'
    )
  })

  it('encodes the referral URL correctly when the username contains an emoji', () => {
    const MissionSocialShare = require('src/components/missionComponents/MissionSocialShare')
      .default
    const mockProps = getMockProps()
    mockProps.user.username = 'Stinky💩'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionSocialShare {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(TextField).at(0).prop('value')).toBe(
      'https://tab.gladly.io/cats/?u=Stinky%F0%9F%92%A9&m=123456789'
    )
  })
})
