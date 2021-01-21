import React from 'react'
import { shallow } from 'enzyme'
import Link from 'src/components/Link'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import withDataSSR from 'src/utils/pageWrappers/withDataSSR'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { accountURL } from 'src/utils/urls'
import { showMockAchievements } from 'src/utils/featureFlags'
import Achievement from 'src/components/Achievement'
import FullPageLoader from 'src/components/FullPageLoader'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('tab-ads')
jest.mock('next-firebase-auth')
jest.mock('@material-ui/icons/Settings')
jest.mock('src/components/Link')
jest.mock('src/utils/navigation')
jest.mock('src/utils/adHelpers')
jest.mock('src/utils/ssr')
jest.mock('src/components/Logo')
jest.mock('src/components/MoneyRaisedContainer')
jest.mock('src/components/SearchInput')
jest.mock('src/utils/featureFlags')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/hooks/useData')
jest.mock('src/components/FullPageLoader')
jest.mock('src/utils/pageWrappers/withDataSSR')

const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
    },
  },
})

beforeEach(() => {
  showMockAchievements.mockReturnValue(false)
})

describe('index.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<IndexPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes a settings icon link to the account page', () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    const settingsLink = wrapper
      .find(Link)
      .filterWhere((el) => el.prop('to') === accountURL)
    expect(settingsLink.exists()).toBe(true)
  })

  it('uses an settings icon button to link to the account page', () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    const settingsLink = wrapper
      .find(Link)
      .filterWhere((el) => el.prop('to') === accountURL)
    expect(settingsLink.childAt(0).type()).toEqual(IconButton)
    expect(settingsLink.childAt(0).childAt(0).type()).toEqual(SettingsIcon)
  })

  it('does not show the achievements content if showMockAchievements returns false', () => {
    expect.assertions(1)
    showMockAchievements.mockReturnValue(false)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find('[data-test-id="achievements"]').exists()).toBe(false)
  })

  it('shows the achievements content if showMockAchievements returns true', () => {
    expect.assertions(1)
    showMockAchievements.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find('[data-test-id="achievements"]').exists()).toBe(true)
  })

  it('the achievements container contains Achievement components', () => {
    expect.assertions(1)
    showMockAchievements.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(
      wrapper.find('[data-test-id="achievements"]').find(Achievement).length
    ).toBeGreaterThan(1)
  })
})

describe('index.js: HOC', () => {
  it('calls `withAuthUser` and shows a loader then redirects if the user is unauthed', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    expect(withAuthUser).toHaveBeenCalledWith({
      whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
      LoaderComponent: FullPageLoader,
      whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    })
  })

  it('calls `withRelay`', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    expect(withRelay).toHaveBeenCalled()
  })
})

describe('index.js: getServerSideProps', () => {
  it('calls `withAuthUserTokenSSR` shows a loader when unauthed', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    await getServerSideProps()
    expect(withAuthUserTokenSSR).toHaveBeenCalledWith({
      whenUnauthed: AuthAction.SHOW_LOADER,
      LoaderComponent: FullPageLoader,
    })
  })

  it('calls `withDataSSR` with a function', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    await getServerSideProps()
    expect(withDataSSR).toHaveBeenCalledWith(expect.any(Function))
  })

  it('returns query info from  the "getRelayQuery" passed to `withDataSSR` when we call it with an AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    getServerSideProps()
    const getRelayQueryFunc = withDataSSR.mock.calls[0][0]
    const response = await getRelayQueryFunc({ AuthUser: getMockAuthUser() })
    expect(response).toEqual({
      query: expect.any(Object),
      variables: {
        userId: 'mock-user-id',
      },
    })
  })

  it('returns an empty object from the "getRelayQuery" passed to `withDataSSR` when we call it with an *unauthed* AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    getServerSideProps()
    const getRelayQueryFunc = withDataSSR.mock.calls[0][0]
    const response = await getRelayQueryFunc({
      AuthUser: { ...getMockAuthUser(), id: null, email: null },
    })
    expect(response).toEqual({})
  })
})
