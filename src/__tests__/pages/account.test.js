import React from 'react'
import { act } from 'react-dom/test-utils'
import { shallow, mount } from 'enzyme'
import { unregister } from 'next-offline/runtime'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import { useAuthUser } from 'next-firebase-auth'
import logout from 'src/utils/auth/logout'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'
import { apiBetaOptIn, dashboardURL } from 'src/utils/urls'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { setWindowLocation } from 'src/utils/navigation'
import SetV4BetaMutation from 'src/utils/mutations/SetV4BetaMutation'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import initializeCMP from 'src/utils/initializeCMP'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import ToggleButton from '@material-ui/lab/ToggleButton'
import SetUserCauseMutation from 'src/utils/mutations/SetUserCauseMutation'
import CauseIcon from 'src/components/CauseIcon'
import Tooltip from '@material-ui/core/Tooltip'

jest.mock('next-offline/runtime')
jest.mock('tab-cmp')
jest.mock('src/utils/initializeCMP')
jest.mock('src/components/SettingsPage')
jest.mock('src/utils/auth/logout')
jest.mock('src/utils/caching')
jest.mock('src/utils/navigation')
jest.mock('src/utils/mutations/SetV4BetaMutation')
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/pageWrappers/withGoogleAnalyticsProperties')
jest.mock('src/utils/hooks/useData')
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/pageWrappers/CustomThemeHOC')
jest.mock('src/utils/hooks/useCustomTheming')
jest.mock('src/utils/mutations/SetUserCauseMutation')
// eslint-disable-next-line react/prop-types
jest.mock('src/components/CauseIcon', () => ({ icon }) => <div icon={icon} />)

const getMockDataResponse = () => ({
  user: {
    id: 'some-user-id',
    email: 'fakeEmail@example.com',
    username: 'IAmFake',
    cause: {
      theme: {
        primaryColor: '#FF0000',
        secondaryColor: 'CCC',
      },
      name: 'Cats',
    },
  },
  app: {
    causes: {
      edges: [
        {
          node: {
            causeId: 'CA6A5C2uj',
            name: 'Cats',
            icon: 'paw',
            isAvailableToSelect: true,
          },
        },
        {
          node: {
            causeId: 'SGa6zohkY',
            name: '#TeamSeas',
            icon: 'jellyfish',
            isAvailableToSelect: true,
          },
        },
      ],
    },
  },
})

const getMockProps = () => ({})

beforeEach(() => {
  useData.mockReturnValue({ data: undefined })
  fetch.mockResolvedValue(getMockFetchResponse())
  clearAllServiceWorkerCaches.mockResolvedValue()
  SetV4BetaMutation.mockResolvedValue()
  useAuthUser.mockReturnValue(getMockAuthUser())
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('account.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AccountPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns a SettingsPage component', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    expect(wrapper.at(0).type()).toEqual(SettingsPage)
  })

  it('has an "Account" title', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const title = content.childAt(0).find(Typography).first()
    expect(title.text()).toEqual('Account')
  })

  it('has a logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.exists()).toBe(true)
  })

  it('passes the expected initial data to `useData`', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<AccountPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).toMatchObject({
      fallbackData: mockProps.data,
    })
  })

  it('passes the expected getRelayQuery function to `useData`', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    shallow(<AccountPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    const queryInfo = await useDataArg.getRelayQuery({
      AuthUser: getMockAuthUser(),
    })
    expect(queryInfo).toMatchObject({
      query: expect.any(Object),
      variables: expect.any(Object),
    })
  })

  it('displays the expected text on the logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.text()).toEqual('Log Out')
  })

  it('calls `logout` when clicking the logout button', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockAuthUser = getMockAuthUser()
    useAuthUser.mockReturnValue(mockAuthUser)
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logout).not.toHaveBeenCalled()
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(logout).toHaveBeenCalledWith(mockAuthUser)
  })

  it('disables the logout button after clicking', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.prop('disabled')).toBe(false)
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(wrapper.find(Button).first().prop('disabled')).toBe(true)
  })

  it('changes the logout text after clicking', async () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.text()).toEqual('Log Out')
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(wrapper.find(Button).first().text()).toEqual('Logging Out...')
  })

  it('displays a Divider after the title', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(1)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays a pending value for the user's username when the fetch is still in progress", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    useData.mockReturnValue({ data: undefined })
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(2).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Username')
    expect(accountItem.find(Typography).at(1).text()).toEqual('...')
  })

  it("displays the user's username when the data fetch is complete", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    useData.mockReturnValue({ data: getMockDataResponse() })
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(2).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Username')
    expect(accountItem.find(Typography).at(1).text()).toEqual('IAmFake')
  })

  it('displays a Divider after the username info', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(3)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays a pending value for the user's email address when the fetch is still in progress", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    useData.mockReturnValue({ data: undefined })
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(4).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Email')
    expect(accountItem.find(Typography).at(1).text()).toEqual('...')
  })

  it("displays the user's email address when the fetch is complete", () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    useData.mockReturnValue({ data: getMockDataResponse() })
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
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(5)
    expect(accountItem.type()).toEqual(Divider)
  })
})

const getRevertAccountItem = (wrapper) =>
  wrapper.find('[data-test-id="revert-v4"]').last()

const getRevertButton = (wrapper) =>
  getRevertAccountItem(wrapper).find(Button).last()

describe('account.js: button to revert to classic Tab for a Cause', () => {
  it('displays the "revert" button field in the advanced options section', () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    const switchModeAccountItem = getRevertAccountItem(wrapper)
    expect(switchModeAccountItem.find(Typography).at(0).text()).toEqual('...')
    expect(switchModeAccountItem.find(Button).first().text()).toEqual(
      'Switch to Classic'
    )
  })

  it('displays cats content in "revert" button field in the advanced options section if cause name  is cats', () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          cause: {
            ...defaultMockData.user.cause,
            name: 'Cats',
          },
        },
      },
    })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const switchModeAccountItem = getRevertAccountItem(wrapper)
    expect(switchModeAccountItem.find(Typography).at(0).text()).toEqual(
      'Leave Tab for Cats'
    )
    expect(switchModeAccountItem.find(Button).first().text()).toEqual(
      'Switch to Classic'
    )
  })

  it('displays #teamseas content in "revert" button field in the advanced options section if cause name is #TeamSeas', () => {
    expect.assertions(2)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          cause: {
            ...defaultMockData.user.cause,
            name: '#TeamSeas',
          },
        },
      },
    })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const switchModeAccountItem = getRevertAccountItem(wrapper)
    expect(switchModeAccountItem.find(Typography).at(0).text()).toEqual(
      'Leave Tab for #TeamSeas'
    )
    expect(switchModeAccountItem.find(Button).first().text()).toEqual(
      'Switch to Classic'
    )
  })

  it('sets the custom theme with cause.theme data', () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          cause: {
            ...defaultMockData.user.cause,
            theme: {
              ...defaultMockData.user.cause.theme,
              primaryColor: '#00FF00',
              secondaryColor: 'DEDEDE',
            },
          },
        },
      },
    })
    const setTheme = useCustomTheming()
    mount(<AccountPage {...mockProps} />)
    expect(setTheme).toHaveBeenCalledWith({
      primaryColor: '#00FF00',
      secondaryColor: 'DEDEDE',
    })
  })

  it('clicking the "revert" button calls the API endpoint as expected', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue(getMockFetchResponse())
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(fetch).toHaveBeenCalledWith(apiBetaOptIn, {
      body: '{"optIn":false}',
      credentials: 'include',
      headers: {
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  })

  it('clicking the "revert" button clears the service worker caches', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(clearAllServiceWorkerCaches).toHaveBeenCalled()
  })

  it('clicking the "revert" button unregisters the service worker', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(unregister).toHaveBeenCalled()
  })

  it('clicking the "revert" button calls SetV4BetaMutation when the user is authenticated', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(SetV4BetaMutation).toHaveBeenCalledWith({
      enabled: false,
      userId: 'some-user-id',
    })
  })

  it('clicking the "revert" button does not call SetV4BetaMutation when the user is not authenticated', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({
      data: { ...getMockDataResponse(), user: undefined },
    })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(SetV4BetaMutation).not.toHaveBeenCalled()
  })

  it('clicking the "revert" button navigates to the dashboard', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: getMockDataResponse() })
    const wrapper = mount(<AccountPage {...mockProps} />)
    const revertButton = getRevertButton(wrapper)
    revertButton.simulate('click')
    await flushAllPromises()
    expect(setWindowLocation).toHaveBeenCalledWith(dashboardURL)
  })
})

describe('account.js: CMP privacy management', () => {
  it('calls initializeCMP on mount', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    mount(<AccountPage {...mockProps} />)
    await flushAllPromises()
    expect(initializeCMP).toHaveBeenCalled()
  })

  it('shows the GDPR data privacy button when the client is in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is in the EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(true)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    // Find the data privacy choices setting.
    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    expect(privacyChoicesSection.find('p').first().text()).toEqual(
      'Data privacy choices'
    )
  })

  it('opens the GDPR dialog when clicking the GDPR data privacy button', async () => {
    expect.assertions(2)

    // Mock that the client is in the EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(true)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    const button = privacyChoicesSection.find('button').first()

    expect(tabCMP.openTCFConsentDialog).not.toHaveBeenCalled()
    button.simulate('click')
    await flushAllPromises()
    expect(tabCMP.openTCFConsentDialog).toHaveBeenCalled()
  })

  it('does not show the GDPR data privacy button when the client is not in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is not in the EU or US
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(false)
    tabCMP.doesCCPAApply.mockResolvedValue(false)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    expect(privacyChoicesSection.exists()).toBe(false)
  })

  it('shows the CCPA data privacy button when the client is in the US', async () => {
    expect.assertions(1)

    // Mock that the client is in the US
    const tabCMP = require('tab-cmp')
    tabCMP.doesCCPAApply.mockResolvedValue(true)
    tabCMP.doesGDPRApply.mockResolvedValue(false)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    expect(privacyChoicesSection.find('p').first().text()).toEqual(
      'Ad personalization choices'
    )
  })

  it('opens the CCPA dialog when clicking the CCPA data privacy link', async () => {
    expect.assertions(2)

    // Mock that the client is in the US
    const tabCMP = require('tab-cmp')
    tabCMP.doesGDPRApply.mockResolvedValue(false)
    tabCMP.doesCCPAApply.mockResolvedValue(true)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    const link = privacyChoicesSection.find('a').first()

    expect(tabCMP.openCCPAConsentDialog).not.toHaveBeenCalled()
    link.simulate('click')
    await flushAllPromises()
    expect(tabCMP.openCCPAConsentDialog).toHaveBeenCalled()
  })

  it('does not show the CCPA data privacy section when the client is not in the US', async () => {
    expect.assertions(1)

    // Mock that the client is not in the US or EU
    const tabCMP = require('tab-cmp')
    tabCMP.doesCCPAApply.mockResolvedValue(false)
    tabCMP.doesGDPRApply.mockResolvedValue(false)

    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })

    const privacyChoicesSection = wrapper.find('[data-test-id="data-privacy"]')
    expect(privacyChoicesSection.exists()).toBe(false)
  })
})

describe('account.js: toggle to switch cause', () => {
  it('displays switch cause toggle for internal users', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          email: 'test@tabforacause.org',
          cause: {
            ...defaultMockData.user.cause,
            name: '#TeamSeas',
          },
        },
      },
    })
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    const switchCause = wrapper.find('[data-test-id="switch-cause"]')
    expect(switchCause.exists()).toBe(true)
  })

  it('toggling to other cause updates user cause', async () => {
    expect.assertions(1)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    SetUserCauseMutation.mockResolvedValue({
      setUserCause: {
        user: {
          cause: {
            theme: {
              primaryColor: '#fff',
              secondaryColor: '#fff',
            },
          },
        },
      },
    })
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          email: 'test@tabforacause.org',
          cause: {
            ...defaultMockData.user.cause,
            name: '#TeamSeas',
          },
        },
      },
    })
    const wrapper = mount(<AccountPage {...mockProps} />)
    wrapper.find(ToggleButton).at(1).simulate('click')
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    expect(SetUserCauseMutation).toHaveBeenCalledWith({
      causeId: 'SGa6zohkY',
      userId: 'some-user-id',
    })
  })

  it('renders icons and tooltips for the available causes', async () => {
    expect.assertions(5)
    const AccountPage = require('src/pages/account').default
    const mockProps = getMockProps()
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({ data: defaultMockData })
    const wrapper = mount(<AccountPage {...mockProps} />)
    await act(async () => {
      await flushAllPromises()
      wrapper.update()
    })
    expect(wrapper.find(ToggleButton).length).toEqual(2)
    expect(
      wrapper.find(ToggleButton).at(0).find(CauseIcon).prop('icon')
    ).toEqual('paw')
    expect(wrapper.find(Tooltip).at(0).prop('title')).toEqual('Tab for Cats')
    expect(
      wrapper.find(ToggleButton).at(1).find(CauseIcon).prop('icon')
    ).toEqual('jellyfish')
    expect(wrapper.find(Tooltip).at(1).prop('title')).toEqual(
      'Tab for #TeamSeas'
    )
  })
})
