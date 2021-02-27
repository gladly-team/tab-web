import React from 'react'
import { shallow, mount } from 'enzyme'
import Link from 'src/components/Link'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import { accountURL } from 'src/utils/urls'
import {
  showMockAchievements,
  showBackgroundImages,
} from 'src/utils/featureFlags'
import Achievement from 'src/components/Achievement'
import FullPageLoader from 'src/components/FullPageLoader'
import UserBackgroundImageContainer from 'src/components/UserBackgroundImageContainer'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import LogTabMutation from 'src/utils/mutations/LogTabMutation'
import uuid from 'uuid/v4'
import LogUserRevenueMutation from 'src/utils/mutations/LogUserRevenueMutation'
import { AdComponent } from 'tab-ads'

jest.mock('uuid/v4')
uuid.mockReturnValue('some-uuid')
jest.mock('tab-ads')
jest.mock('next-firebase-auth')
jest.mock('@material-ui/icons/Settings')
jest.mock('src/components/Link')
jest.mock('src/utils/navigation')
jest.mock('src/utils/adHelpers')
jest.mock('src/utils/ssr')
jest.mock('src/utils/adHelpers', () => ({
  getAdUnits: jest.fn().mockReturnValue({}),
}))
jest.mock('src/components/Logo')
jest.mock('src/components/MoneyRaisedContainer', () => () => <div />)
jest.mock('src/components/SearchInput', () => () => <div />)
jest.mock('src/utils/featureFlags')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/hooks/useData')
jest.mock('src/components/FullPageLoader')
jest.mock('src/components/UserBackgroundImageContainer')
jest.mock('src/utils/pageWrappers/withDataSSR')
jest.mock('src/components/NewTabThemeWrapperHOC', () => (component) =>
  component
)
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/mutations/LogTabMutation')
const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
      id: 'asdf',
    },
  },
})

beforeEach(() => {
  showMockAchievements.mockReturnValue(false)
  showBackgroundImages.mockReturnValue(false)
  useData.mockReturnValue({ data: getMockProps().data })
  process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
})

afterEach(() => {
  jest.clearAllMocks()
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

  it('renders a loading component (instead of the new tab page) if no initial data is provided', () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = {} // no initial data
    useData.mockReturnValue({ data: undefined }) // no fetched data yet
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(FullPageLoader).exists()).toBe(true)
    expect(wrapper.find('[data-test-id="new-tab-page"]').exists()).toBe(false)
  })

  it('renders the new tab page (and stops showing a loader) after we fetch data', () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = {} // no initial data
    useData.mockReturnValue({ data: getMockProps().data })
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(FullPageLoader).exists()).toBe(false)
    expect(wrapper.find('[data-test-id="new-tab-page"]').exists()).toBe(true)
  })

  it('passes the expected initial data to `useData`', () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<IndexPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).toMatchObject({
      initialData: mockProps.data,
    })
  })

  it('passes the expected getRelayQuery function to `useData`', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<IndexPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    const queryInfo = await useDataArg.getRelayQuery({
      AuthUser: getMockAuthUser(),
    })
    expect(queryInfo).toMatchObject({
      query: expect.any(Object),
      variables: expect.any(Object),
    })
  })

  it('passes "revalidateOnMount" = true to `useData` when the service worker is enabled', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'true'
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<IndexPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).toMatchObject({
      revalidateOnMount: true,
    })
  })

  it('passes "revalidateOnMount" = false to `useData` when the service worker is *not* enabled', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<IndexPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).not.toHaveProperty('revalidateOnMount')
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

  it('does not show the background image container if showBackgroundImages returns false', () => {
    expect.assertions(1)
    showBackgroundImages.mockReturnValue(false)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(UserBackgroundImageContainer).exists()).toBe(false)
  })

  it('does show the background image container if showBackgroundImages returns true', () => {
    expect.assertions(1)
    showBackgroundImages.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(UserBackgroundImageContainer).exists()).toBe(true)
  })

  it('logs a tab count if the user is defined', () => {
    const mockProps = getMockProps()
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(LogTabMutation).toHaveBeenCalledWith('asdf', 'some-uuid')
  })

  it('does not log a tab count if user is not defined', () => {
    const mockProps = getMockProps()
    useData.mockReturnValue({
      data: {
        app: {},
        user: {
          tabs: 221,
          vcCurrent: 78,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(LogTabMutation).not.toHaveBeenCalled()
  })

  it('calls LogUserRevenueMutation for each Ad when the onAdDisplayed prop is invoked', () => {
    const IndexPage = require('src/pages/index').default
    const wrapper = shallow(<IndexPage {...getMockProps()} />)
    const firstAd = wrapper.find(AdComponent).at(0)
    const secondAd = wrapper.find(AdComponent).at(1)
    const thirdAd = wrapper.find(AdComponent).at(2)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: 'encoded-first-ad',
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)
    secondAd.prop('onAdDisplayed')({
      ...mockDisplayedAdInfo,
      adId: 'second-ad-here',
      revenue: 0.082,
      encodedRevenue: 'encoded-second-ad',
      GAMAdvertiserId: 2222,
      GAMAdUnitId: '/12345/SecondAdThing',
      adSize: '300x250',
    })
    thirdAd.prop('onAdDisplayed')({
      ...mockDisplayedAdInfo,
      adId: 'third-ad-here',
      revenue: 0.0001472,
      encodedRevenue: 'encoded-third-ad',
      GAMAdvertiserId: 3333,
      GAMAdUnitId: '/12345/ThirdAdHere',
      adSize: '300x250',
    })

    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
    expect(LogUserRevenueMutation.mock.calls[1][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.082,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-second-ad',
      },
      dfpAdvertiserId: '2222',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SecondAdThing',
    })
    expect(LogUserRevenueMutation.mock.calls[2][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0001472,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-third-ad',
      },
      dfpAdvertiserId: '3333',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/ThirdAdHere',
    })
  })

  it('does not call LogUserRevenueMutation when the ad info is null', () => {
    const IndexPage = require('src/pages/index').default
    const wrapper = shallow(<IndexPage {...getMockProps()} />)
    const firstAd = wrapper.find(AdComponent).at(0)
    const secondAd = wrapper.find(AdComponent).at(1)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: 'encoded-first-ad',
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)
    secondAd.prop('onAdDisplayed')(null) // no ad

    expect(LogUserRevenueMutation).toHaveBeenCalledTimes(1)
    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })

  it('does not include encodedRevenue in the LogUserRevenueMutation when the encodedRevenue value is nil', () => {
    const IndexPage = require('src/pages/index').default
    const wrapper = shallow(<IndexPage {...getMockProps()} />)
    const firstAd = wrapper.find(AdComponent).at(0)

    const mockDisplayedAdInfo = {
      adId: 'first-ad-here',
      revenue: 0.0123,
      encodedRevenue: null, // no encodedRevenue
      GAMAdvertiserId: 1111,
      GAMAdUnitId: '/12345/SomeAdUnit',
      adSize: '728x90',
    }

    // Call each Ad's onAdDisplayed with a mock ad info.
    firstAd.prop('onAdDisplayed')(mockDisplayedAdInfo)

    expect(LogUserRevenueMutation).toHaveBeenCalledTimes(1)
    expect(LogUserRevenueMutation.mock.calls[0][0]).toEqual({
      userId: 'abc-123',
      revenue: 0.0123,
      // no encodedRevenue value
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: null,
      tabId: '101b73c7-468c-4d29-b224-0c07f621bc52',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })
})
