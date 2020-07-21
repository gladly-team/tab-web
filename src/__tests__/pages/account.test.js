import React from 'react'
import { shallow } from 'enzyme'
import { unregister } from 'next-offline/runtime'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import logout from 'src/utils/auth/logout'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'
import { apiBetaOptIn, dashboardURL } from 'src/utils/urls'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { setWindowLocation } from 'src/utils/navigation'
import SetV4BetaMutation from 'src/utils/mutations/SetV4BetaMutation'

jest.mock('next-offline/runtime')
jest.mock('src/components/SettingsPage')
jest.mock('src/utils/pageWrappers/withAuthAndData')
jest.mock('src/utils/auth/logout')
jest.mock('src/utils/caching')
jest.mock('src/utils/navigation')
jest.mock('src/utils/mutations/SetV4BetaMutation')

const getMockProps = () => ({
  user: {
    id: 'some-user-id',
    email: 'fakeEmail@example.com',
    username: 'IAmFake',
  },
})

beforeEach(() => {
  fetch.mockResolvedValue(getMockFetchResponse())
  clearAllServiceWorkerCaches.mockResolvedValue()
  SetV4BetaMutation.mockResolvedValue()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('account.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AccountPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns a SettingsPage component', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    expect(wrapper.at(0).type()).toEqual(SettingsPage)
  })

  it('has an "Account" title', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const title = content.childAt(0).find(Typography).first()
    expect(title.text()).toEqual('Account')
  })

  it('has a logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.exists()).toBe(true)
  })

  it('displays the expected text on the logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.text()).toEqual('Log Out')
  })

  it('calls `logout` when clicking the logout button', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logout).not.toHaveBeenCalled()
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(logout).toHaveBeenCalled()
  })

  it('disables the logout button after clicking', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.prop('disabled')).toBe(false)
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(wrapper.find(Button).first().prop('disabled')).toBe(true)
  })

  it('changes the logout text after clicking', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.text()).toEqual('Log Out')
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(wrapper.find(Button).first().text()).toEqual('Logging Out...')
  })

  it('displays a Divider after the title', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(1)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's username", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(2).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Username')
    expect(accountItem.find(Typography).at(1).text()).toEqual('IAmFake')
  })

  it('displays a Divider after the username info', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(3)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's email address", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(4).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Email')
    expect(accountItem.find(Typography).at(1).text()).toEqual(
      'fakeEmail@example.com'
    )
  })

  it('displays a Divider after the email address', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(5)
    expect(accountItem.type()).toEqual(Divider)
  })

  it('displays the "switch back to classic" field', () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Beta Enabled')
    expect(accountItem.find(Button).first().text()).toEqual('Switch to Classic')
  })

  it('clicking the "switch back to classic" button calls the API endpoint as expected', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue(getMockFetchResponse())
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    const optOutButton = accountItem.find(Button).first()
    optOutButton.simulate('click')
    await flushAllPromises()
    expect(fetch).toHaveBeenCalledWith(apiBetaOptIn, {
      body: '{"optIn":false}',
      credentials: 'include',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    })
  })

  it('clicking the "switch back to classic" clears the service worker caches', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    const optOutButton = accountItem.find(Button).first()
    optOutButton.simulate('click')
    await flushAllPromises()
    expect(clearAllServiceWorkerCaches).toHaveBeenCalled()
  })

  it('clicking the "switch back to classic" unregisters the service worker', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    const optOutButton = accountItem.find(Button).first()
    optOutButton.simulate('click')
    await flushAllPromises()
    expect(unregister).toHaveBeenCalled()
  })

  it('clicking the "switch back to classic" calls SetV4BetaMutation', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = {
      ...getMockProps(),
      user: {
        ...getMockProps(),
        id: 'my-wonderful-user-id',
      },
    }
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    const optOutButton = accountItem.find(Button).first()
    optOutButton.simulate('click')
    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalledWith({
      enabled: false,
      userId: 'my-wonderful-user-id',
    })
  })

  it('clicking the "switch back to classic" navigates to the dashboard', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(6).dive()
    const optOutButton = accountItem.find(Button).first()
    optOutButton.simulate('click')
    await flushAllPromises()
    expect(setWindowLocation).toHaveBeenCalledWith(dashboardURL)
  })
})

describe('account.js: getInitialProps', () => {
  it('does not define getInitialProps', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account.js').default
    expect(AccountPage.getInitialProps).toBeUndefined()
  })
})
