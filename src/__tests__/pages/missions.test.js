import React from 'react'
import { shallow, mount } from 'enzyme'
import Link from 'src/components/Link'
import { dashboardURL } from 'src/utils/urls'
import CloseIcon from '@material-ui/icons/Close'
import FullPageLoader from 'src/components/FullPageLoader'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import { ThemeProvider } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import theme from 'src/utils/theme'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'

jest.mock('next-firebase-auth')
jest.mock('src/components/Link')
jest.mock('src/utils/navigation')
jest.mock('src/utils/ssr')
jest.mock('src/utils/pageWrappers/CustomThemeHOC')
jest.mock('src/utils/hooks/useCustomTheming')
jest.mock(
  'src/components/missionComponents/CurrentMissionContainer',
  () => () => <div style={{ height: '200px' }} />
)
jest.mock(
  'src/components/missionComponents/PastMissionsContainer',
  () => () => <div style={{ height: '200px' }} />
)
jest.mock('src/utils/featureFlags')
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/hooks/useData')
jest.mock('src/components/FullPageLoader', () => () => <div />)
jest.mock('src/utils/pageWrappers/withDataSSR')
jest.mock('src/utils/pageWrappers/withSentry')

global.scrollTo = jest.fn()
const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
      id: 'asdf',
      hasViewedIntroFlow: true,
      cause: {
        theme: {
          primaryColor: '#FF0000',
          secondaryColor: '#DEDEDE',
        },
      },
    },
  },
})

beforeEach(() => {
  useData.mockReturnValue({ data: getMockProps().data })
  process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('missions.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(
        <ThemeProvider theme={theme}>
          <MissionsPage {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('renders a loading component (instead of the mission page) if no initial data is provided', () => {
    expect.assertions(2)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = {} // no initial data
    useData.mockReturnValue({ data: undefined }) // no fetched data yet
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(FullPageLoader).exists()).toBe(true)
    expect(wrapper.find('[data-test-id="missions-page"]').exists()).toBe(false)
  })

  it('renders the mission page (and stops showing a loader) after we fetch data', () => {
    expect.assertions(2)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = {} // no initial data
    useData.mockReturnValue({ data: getMockProps().data })
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(FullPageLoader).exists()).toBe(false)
    expect(wrapper.find('[data-test-id="missions-page"]').exists()).toBe(true)
  })

  it('passes the expected initial data to `useData`', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).toMatchObject({
      fallbackData: mockProps.data,
    })
  })

  it('passes the expected getRelayQuery function to `useData`', async () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const useDataArg = useData.mock.calls[0][0]
    const queryInfo = await useDataArg.getRelayQuery({
      AuthUser: getMockAuthUser(),
    })
    expect(queryInfo).toMatchObject({
      query: expect.any(Object),
      variables: expect.any(Object),
    })
  })

  it('sets the custom theme with cause.theme data', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          cause: {
            ...defaultMockProps.data.user.cause,
            theme: {
              ...defaultMockProps.data.user.cause.theme,
              primaryColor: '#00FF00',
              secondaryColor: 'DEDEDE',
            },
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const setTheme = useCustomTheming()
    mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    expect(setTheme).toHaveBeenCalledWith({
      primaryColor: '#00FF00',
      secondaryColor: 'DEDEDE',
    })
  })

  it('has a close button', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const closeButton = wrapper.find(CloseIcon)
    expect(closeButton.exists()).toBe(true)
  })

  it('close Button links back to the home page', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const settingsLink = wrapper
      .find(Link)
      .filterWhere((el) => el.prop('to') === dashboardURL)
    expect(settingsLink.exists()).toBe(true)
  })

  it('clicking on past missions subnav scrolls page', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const PastMissionsSubNav = wrapper
      .find(Tab)
      .filterWhere((el) => el.prop('label') === 'Past Missions')
    PastMissionsSubNav.simulate('click')
    expect(global.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      left: 0,
      top: -160,
    })
  })
  it('clicking on current missions subnav scrolls page', () => {
    expect.assertions(1)
    const MissionsPage = require('src/pages/missions').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionsPage {...mockProps} />
      </ThemeProvider>
    )
    const PastMissionsSubNav = wrapper
      .find(Tab)
      .filterWhere((el) => el.prop('label') === 'Your Squad')
    PastMissionsSubNav.simulate('click')
    expect(global.scrollTo).toHaveBeenCalled()
  })
})
