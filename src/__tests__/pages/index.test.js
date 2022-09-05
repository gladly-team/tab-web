import React from 'react'
import { shallow, mount } from 'enzyme'
import Link from 'src/components/Link'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import { aboutURL, accountURL } from 'src/utils/urls'
import { act } from 'react-dom/test-utils'
import {
  STORAGE_NEW_USER_CAUSE_ID,
  AMBASSADOR_2022_NOTIFICATION,
  HAS_SEEN_SEARCH_V2_TOOLTIP,
} from 'src/utils/constants'
import {
  showMockAchievements,
  showBackgroundImages,
  showDevelopmentOnlyMissionsFeature,
  showInternalOnly,
} from 'src/utils/featureFlags'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import Achievement from 'src/components/Achievement'
import FullPageLoader from 'src/components/FullPageLoader'
import localStorageMgr from 'src/utils/localstorage-mgr'
import OnboardingFlow from 'src/components/OnboardingFlow'
import UserBackgroundImageContainer from 'src/components/UserBackgroundImageContainer'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import LogTabMutation from 'src/utils/mutations/LogTabMutation'
import { v4 as uuid } from 'uuid'
import LogUserRevenueMutation from 'src/utils/mutations/LogUserRevenueMutation'
import { AdComponent } from 'tab-ads'
import { isClientSide } from 'src/utils/ssr'
import { getAdUnits } from 'src/utils/adHelpers'
import { accountCreated, newTabView } from 'src/utils/events'
import MissionHubButton from 'src/components/MissionHubButton'
import InviteFriendsIconContainer from 'src/components/InviteFriendsIconContainer'
import SquadCounter from 'src/components/SquadCounter'
import UserImpactContainer from 'src/components/UserImpactContainer'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import { useGrowthBook } from '@growthbook/growthbook-react'
import { validateAttributesObject } from 'src/utils/growthbook'
import SearchInput from 'src/components/SearchInput'
import SearchForACauseSellModal from 'src/components/SearchForACauseSellModal'
import SearchForACauseSellNotification from 'src/components/SearchForACauseSellNotification'
import SfacExtensionSellNotification from 'src/components/SfacExtensionSellNotification'
import { Button } from '@material-ui/core'
import Notification from 'src/components/Notification'
import Chip from '@material-ui/core/Chip'
import { goTo } from 'src/utils/navigation'
import { YAHOO_SEARCH_NEW_USERS_V2 } from 'src/utils/experiments'
import useDoesBrowserSupportSearchExtension from 'src/utils/hooks/useDoesBrowserSupportSearchExtension'
import useBrowserName from 'src/utils/hooks/useBrowserName'

jest.mock('uuid')
uuid.mockReturnValue('some-uuid')
jest.mock('next-firebase-auth')
jest.mock('tab-ads')
jest.mock('@material-ui/icons/Settings', () => () => <div />)
jest.mock('src/components/Link')
jest.mock('src/utils/navigation')
jest.mock('src/utils/events')
jest.mock('src/utils/ssr')
jest.mock('src/utils/adHelpers', () => ({
  getAdUnits: jest.fn().mockReturnValue({}),
  incrementTabsOpenedToday: jest.fn(),
}))
jest.mock('src/utils/localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))
jest.mock('src/utils/mutations/SetHasViewedIntroFlowMutation', () => () => {})
jest.mock('src/components/OnboardingFlow', () => () => <div />)
jest.mock('src/components/Logo')
jest.mock('src/components/MoneyRaisedContainer', () => () => <div />)
jest.mock('src/components/InviteFriendsIconContainer', () => () => <div />)
jest.mock('src/components/UserImpactContainer', () => () => <div />)
jest.mock('src/components/SearchInput', () => () => <div />)
jest.mock('src/utils/featureFlags')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/pageWrappers/withGoogleAnalyticsProperties')
jest.mock('src/utils/hooks/useData')
jest.mock('src/components/FullPageLoader')
jest.mock('src/components/UserBackgroundImageContainer')
jest.mock('src/utils/pageWrappers/withDataSSR')
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/mutations/LogTabMutation')
jest.mock('src/utils/mutations/UpdateImpactMutation')
jest.mock('src/utils/mutations/LogUserRevenueMutation')
jest.mock('src/utils/caching')
jest.mock('src/components/SquadCounter')
jest.mock('src/components/UserImpactContainer')
jest.mock('src/utils/pageWrappers/CustomThemeHOC')
jest.mock('src/utils/hooks/useCustomTheming')
jest.mock('@growthbook/growthbook-react')
jest.mock('src/utils/growthbook')
jest.mock('src/utils/logger')
jest.mock('src/utils/hooks/useDoesBrowserSupportSearchExtension')
jest.mock('src/utils/hooks/useBrowserName')

const setUpAds = () => {
  isClientSide.mockReturnValue(true)
  getAdUnits.mockReturnValue({
    leaderboard: {
      // The long leaderboard ad.
      adId: 'div-gpt-ad-1464385677836-0',
      adUnitId: '/43865596/HBTL',
      sizes: [[728, 90]],
    },
    rectangleAdPrimary: {
      // The primary rectangle ad (bottom-right).
      adId: 'div-gpt-ad-1464385742501-0',
      adUnitId: '/43865596/HBTR',
      sizes: [[300, 250]],
    },
    rectangleAdSecondary: {
      // The second rectangle ad (right side, above the first).
      adId: 'div-gpt-ad-1539903223131-0',
      adUnitId: '/43865596/HBTR2',
      sizes: [[300, 250]],
    },
  })
}

const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
      id: 'asdf',
      joined: '2021-01-29T18:37:04.604Z',
      hasViewedIntroFlow: true,
      currentMission: undefined,
      cause: {
        causeId: 'testSetMe',
        impactVisits: 12,
        landingPagePath: '/foo/',
        individualImpactEnabled: true,
        name: 'Example Cause',
        onboarding: {
          steps: [],
        },
        theme: {
          primaryColor: '#FF0000',
          secondaryColor: '#DEDEDE',
        },
      },
      features: [],
      searches: 10,
    },
    userImpact: {
      userId: 'asdf',
      visitsUntilNextImpact: 2,
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
      userImpactMetric: 3,
      confirmedImpact: true,
      hasClaimedLatestReward: true,
    },
  },
})

const getMockCurrentMission = () => ({
  status: 'started',
  tabGoal: 100,
  tabCount: 6,
  missionId: 'abc-123',
})

beforeEach(() => {
  showMockAchievements.mockReturnValue(false)
  showBackgroundImages.mockReturnValue(false)
  useData.mockReturnValue({ data: getMockProps().data, isDataFresh: true })
  process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
  useDoesBrowserSupportSearchExtension.mockReturnValue(true)
  useBrowserName.mockReturnValue('chrome')
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
      fallbackData: mockProps.data,
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

  it('sets the custom theme with cause.theme data', () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
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
    mount(<IndexPage {...mockProps} />)
    expect(setTheme).toHaveBeenCalledWith({
      primaryColor: '#00FF00',
      secondaryColor: 'DEDEDE',
    })
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

  it('shows the invite friends icon if showDevelopmentOnlyMissionsFeature returns false', () => {
    expect.assertions(2)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(false)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(InviteFriendsIconContainer).exists()).toBe(true)
    expect(wrapper.find(MissionHubButton).exists()).toBe(false)
  })

  it('shows the missionHub button if showDevelopmentOnlyMissionsFeature returns true', () => {
    expect.assertions(2)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(MissionHubButton).exists()).toBe(true)
    expect(wrapper.find(InviteFriendsIconContainer).exists()).toBe(false)
  })

  it('shows the SquadCounter when in a mission if showDevelopmentOnlyMissionsFeature is true', () => {
    expect.assertions(1)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          id: 'another-id',
          currentMission: {
            ...getMockCurrentMission(),
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(SquadCounter).exists()).toBe(true)
  })

  it('disables the impact counter when in a mission if showDevelopmentOnlyMissionsFeature is true', () => {
    expect.assertions(1)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          id: 'another-id',
          currentMission: {
            ...getMockCurrentMission(),
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(UserImpactContainer).prop('disabled')).toBe(true)
  })

  it('does not include the UserImpactContainer if individualImpactEnabled false, displays info button instead', () => {
    expect.assertions(1)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(true)
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          cause: {
            ...defaultMockProps.data.user.cause,
            causeId: 'testSetMe',
            impactVisits: 12,
            landingPagePath: '/foo/',
            individualImpactEnabled: false,
            onboarding: {
              steps: [],
            },
            theme: {
              primaryColor: '#FF0000',
              secondaryColor: '#DEDEDE',
            },
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(UserImpactContainer)).toHaveLength(0)
  })

  it('does *not* show the SquadCounter, even when in a mission, if showDevelopmentOnlyMissionsFeature is false', () => {
    expect.assertions(1)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(false)
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          id: 'another-id',
          currentMission: {
            ...getMockCurrentMission(),
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(SquadCounter).exists()).toBe(false)
  })

  it('does *not* disable the impact counter when in a mission, if showDevelopmentOnlyMissionsFeature is false', () => {
    expect.assertions(1)
    showDevelopmentOnlyMissionsFeature.mockReturnValue(false)
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          id: 'another-id',
          currentMission: {
            ...getMockCurrentMission(),
          },
        },
      },
    }
    useData.mockReturnValue(mockProps)
    const wrapper = shallow(<IndexPage {...mockProps} />)
    expect(wrapper.find(UserImpactContainer).prop('disabled')).toBe(false)
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
          hasViewedIntroFlow: true,
        },
        userImpact: {
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(LogTabMutation).not.toHaveBeenCalled()
  })

  it('logs to facebook and reddit if the user is defined', () => {
    const mockProps = getMockProps()
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(newTabView).toHaveBeenCalled()
  })

  it('does not log to facebook and reddit if user is not defined', () => {
    const mockProps = getMockProps()
    useData.mockReturnValue({
      data: {
        app: {},
        user: {
          tabs: 221,
          vcCurrent: 78,
          hasViewedIntroFlow: true,
        },
        userImpact: {
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(newTabView).not.toHaveBeenCalled()
  })

  it('logs to facebook and reddit if user is visiting for the first time', () => {
    const mockProps = getMockProps()
    useData.mockReturnValue({
      data: {
        app: {},
        user: {
          tabs: 0,
          id: 'asdf',
          vcCurrent: 78,
          hasViewedIntroFlow: true,
        },
        userImpact: {
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(accountCreated).toHaveBeenCalled()
  })

  it('does not log account created to facebook and reddit if user is not visiting for the first time', () => {
    const mockProps = getMockProps()
    useData.mockReturnValue({
      data: {
        app: {},
        user: {
          tabs: 1,
          id: 'asdf',
          vcCurrent: 78,
          hasViewedIntroFlow: true,
        },
        userImpact: {
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(accountCreated).not.toHaveBeenCalled()
  })

  it('calls LogUserRevenueMutation for each Ad when the onAdDisplayed prop is invoked', () => {
    setUpAds()
    const IndexPage = require('src/pages/index').default
    const wrapper = mount(<IndexPage {...getMockProps()} />)
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
      userId: 'asdf',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: 'some-uuid',
      adUnitCode: '/12345/SomeAdUnit',
    })
    expect(LogUserRevenueMutation.mock.calls[1][0]).toEqual({
      userId: 'asdf',
      revenue: 0.082,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-second-ad',
      },
      dfpAdvertiserId: '2222',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: 'some-uuid',
      adUnitCode: '/12345/SecondAdThing',
    })
    expect(LogUserRevenueMutation.mock.calls[2][0]).toEqual({
      userId: 'asdf',
      revenue: 0.0001472,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-third-ad',
      },
      dfpAdvertiserId: '3333',
      adSize: '300x250',
      aggregationOperation: 'MAX',
      tabId: 'some-uuid',
      adUnitCode: '/12345/ThirdAdHere',
    })
  })

  it('does not call LogUserRevenueMutation when the ad info is null', () => {
    setUpAds()
    const IndexPage = require('src/pages/index').default
    const wrapper = mount(<IndexPage {...getMockProps()} />)
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
      userId: 'asdf',
      revenue: 0.0123,
      encodedRevenue: {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'encoded-first-ad',
      },
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: 'MAX',
      tabId: 'some-uuid',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })

  it('does not include encodedRevenue in the LogUserRevenueMutation when the encodedRevenue value is nil', () => {
    setUpAds()
    const IndexPage = require('src/pages/index').default
    const wrapper = mount(<IndexPage {...getMockProps()} />)
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
      userId: 'asdf',
      revenue: 0.0123,

      // no encodedRevenue value
      dfpAdvertiserId: '1111',
      adSize: '728x90',
      aggregationOperation: null,
      tabId: 'some-uuid',
      adUnitCode: '/12345/SomeAdUnit',
    })
  })

  it('shows the intro flow if a user has not completed it', () => {
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        app: {},
        user: {
          ...defaultMockProps.data.user,
          tabs: 221,
          vcCurrent: 78,
          id: 'asdf',
          hasViewedIntroFlow: false,
          cause: {
            ...defaultMockProps.data.user.cause,
            onboarding: {
              steps: [],
            },
          },
        },
        userImpact: {
          ...defaultMockProps.data.userImpact,
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    }
    useData.mockReturnValue({
      data: {
        ...getMockProps().data,
        user: {
          tabs: 221,
          vcCurrent: 78,
          id: 'asdf',
          hasViewedIntroFlow: false,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    const wrapper = mount(<IndexPage {...mockProps} />)
    expect(wrapper.find(OnboardingFlow).exists()).toBe(true)
  })

  it('shows the homepage once a user completes the introflow', async () => {
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        app: {},
        user: {
          ...defaultMockProps.data.user,
          tabs: 221,
          vcCurrent: 78,
          id: 'asdf',
          hasViewedIntroFlow: false,
          cause: {
            ...defaultMockProps.data.user.cause,
            onboarding: {
              steps: [],
            },
          },
        },
        userImpact: {
          ...defaultMockProps.data.userImpact,
          userId: 'asdf',
          visitsUntilNextImpact: 2,
          pendingUserReferralImpact: 10,
          pendingUserReferralCount: 1,
          userImpactMetric: 3,
          confirmedImpact: true,
          hasClaimedLatestReward: true,
        },
      },
    }
    useData.mockReturnValue({
      data: {
        ...getMockProps().data,
        user: {
          tabs: 221,
          vcCurrent: 78,
          id: 'asdf',
          hasViewedIntroFlow: false,
        },
      },
    })
    const IndexPage = require('src/pages/index').default
    const wrapper = mount(<IndexPage {...mockProps} />)
    expect(wrapper.find(OnboardingFlow).exists()).toBe(true)
    const flow = wrapper.find(OnboardingFlow)
    await act(async () => {
      flow.props().onComplete()
      await flushAllPromises()
      wrapper.update()
    })
    expect(wrapper.find(OnboardingFlow).exists()).toBe(false)
  })

  it('sets the cause id for tab ads', () => {
    const mockProps = getMockProps()
    const IndexPage = require('src/pages/index').default
    mount(<IndexPage {...mockProps} />)
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_NEW_USER_CAUSE_ID,
      'testSetMe'
    )
  })

  it('calls setFeatures on growthbook with correct values when the user is defined', async () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({ value: true }),
      setAttributes: jest.fn(),
    }
    useGrowthBook.mockReturnValue(mockGrowthbook)
    mount(<IndexPage {...mockProps} />)

    const expectedAttributesObject = {
      id: mockProps.data.user.id,
      env: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV,
      causeId: mockProps.data.user.cause.causeId,
      v4BetaEnabled: true,
      joined: mockProps.data.user.joined,
      isTabTeamMember: showInternalOnly(mockProps.data.user.email),
    }
    expect(validateAttributesObject).toHaveBeenCalledWith(
      mockProps.data.user.id,
      expectedAttributesObject
    )
    expect(mockGrowthbook.setAttributes).toHaveBeenCalledWith(
      expectedAttributesObject
    )
  })

  it('does not call setFeatures on growthbook when the user is not defined', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default

    // Suppress expected proptypes errors.
    const consoleErrSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: undefined,
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue(mockProps.data),
      setAttributes: jest.fn(),
    }
    useGrowthBook.mockReturnValue(mockGrowthbook)
    mount(<IndexPage {...mockProps} />)
    expect(mockGrowthbook.setAttributes).not.toHaveBeenCalled()
    consoleErrSpy.mockRestore()
  })

  it('correctly handles set extra search impact flow when accepting', () => {
    expect.assertions(6)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = mount(<IndexPage {...mockProps} />)

    expect(wrapper.find(SearchForACauseSellModal).prop('open')).toBe(false)
    expect(
      wrapper.find(SearchInput).first().prop('setYahooPaidSearchRewardOptIn')
    ).toEqual(undefined)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchSelectMoreInfoClick')()
    })
    wrapper.update()

    const modal = wrapper.find(SearchForACauseSellModal).first()
    expect(modal.prop('open')).toBe(true)
    expect(modal.prop('hardSell')).toBe(true)

    const acceptButton = wrapper.find(Button).at(1)
    expect(acceptButton.text()).toEqual("Let's Do It!")
    acceptButton.simulate('click')
    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(
      'Great! You can always switch your search engine here later on.'
    )
  })

  it('correctly handles set extra search impact flow when declining', () => {
    expect.assertions(6)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    const wrapper = mount(<IndexPage {...mockProps} />)

    expect(wrapper.find(SearchForACauseSellModal).prop('open')).toBe(false)
    expect(
      wrapper.find(SearchInput).first().prop('setYahooPaidSearchRewardOptIn')
    ).toEqual(undefined)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchSelectMoreInfoClick')()
    })
    wrapper.update()

    const modal = wrapper.find(SearchForACauseSellModal).first()
    expect(modal.prop('open')).toBe(true)
    expect(modal.prop('hardSell')).toBe(true)

    const acceptButton = wrapper.find(Button).at(0)
    expect(acceptButton.text()).toEqual("I don't want more impact")
    acceptButton.simulate('click')
    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(false)
  })

  it('does not render a SFAC sell notification if showYahooPrompt is not true', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    const notification = wrapper.find(SearchForACauseSellNotification)
    expect(notification.exists()).toBe(false)
  })

  it('does render a SFAC sell notification if showYahooPrompt is true', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showYahooPrompt = true
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    const notification = wrapper.find(SearchForACauseSellNotification)
    expect(wrapper.find(SearchInput).first().prop('tooltip')).toBe(false)
    expect(notification.exists()).toBe(true)
  })

  it('does not render a SFAC extension notification if showSfacExtensionPrompt is not true', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)

    const notification = wrapper.find(SfacExtensionSellNotification)
    expect(notification.exists()).toBe(false)
  })

  it('does not render a SFAC extension notification if browser is unsupported', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    useDoesBrowserSupportSearchExtension.mockReturnValue(false)
    mockProps.data.user.showSfacExtensionPrompt = true
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)

    const notification = wrapper.find(SfacExtensionSellNotification)
    expect(notification.exists()).toBe(false)
  })

  it('does render a SFAC extension notification if showSfacExtensionPrompt is true', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showSfacExtensionPrompt = true
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(SfacExtensionSellNotification)
    expect(notification.exists()).toBe(true)
  })

  it('only renders the SFAC extension notification after fresh data is fetched', () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showSfacExtensionPrompt = true
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: false }) // not fresh
    const wrapper = mount(<IndexPage {...mockProps} />)
    expect(wrapper.find(SfacExtensionSellNotification).exists()).toBe(false)
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true }) // fresh
    wrapper.setProps({ ...mockProps }) // force a rerender after hook change
    wrapper.update()
    expect(wrapper.find(SfacExtensionSellNotification).exists()).toBe(true)
  })

  it('passes the correct browser name to SFAC extension notification', () => {
    useBrowserName.mockReturnValue('firefox')
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showSfacExtensionPrompt = true
    useData.mockReturnValue({ data: mockProps.data, isDataFresh: true })
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(SfacExtensionSellNotification)
    expect(notification.prop('browser')).toEqual('firefox')
  })

  it('clicking learn more on SFAC sell notification opens modal in normal mode', async () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showYahooPrompt = true
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    const notification = wrapper.find(SearchForACauseSellNotification)
    const learnMoreButton = notification.find(Button).at(0)

    learnMoreButton.simulate('click')

    const sfacModal = wrapper.find(SearchForACauseSellModal).at(0)
    expect(sfacModal.prop('open')).toEqual(true)
    expect(sfacModal.prop('hardSell')).toEqual(false)
  })

  it('clicking no thanks on SFAC sell notification opens modal in hard sell mode', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showYahooPrompt = true
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    const notification = wrapper.find(SearchForACauseSellNotification)
    const noThanksButton = notification.find(Button).at(1)

    noThanksButton.simulate('click')

    const sfacModal = wrapper.find(SearchForACauseSellModal).at(0)
    expect(sfacModal.prop('open')).toEqual(true)
    expect(sfacModal.prop('hardSell')).toEqual(true)
  })

  it('clicking accept on SFAC sell notification sets tooltip', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showYahooPrompt = true
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    const notification = wrapper.find(SearchForACauseSellNotification)
    const acceptButton = notification.find(Button).at(2)

    acceptButton.simulate('click')

    expect(wrapper.find(SearchForACauseSellModal).prop('open')).toBe(false)
    expect(wrapper.find(SearchInput).first().prop('tooltip')).toBe(
      'Great! You can always switch your search engine here later on.'
    )
  })

  it('accepting sfac modal while sfac notification is open closes the modal', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    mockProps.data.user.showYahooPrompt = true
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    expect(wrapper.find(SearchForACauseSellModal).prop('open')).toBe(false)
    expect(
      wrapper.find(SearchInput).first().prop('setYahooPaidSearchRewardOptIn')
    ).toEqual(undefined)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
      wrapper.find(SearchInput).first().prop('onSearchSelectMoreInfoClick')()
    })
    wrapper.update()

    const modal = wrapper.find(SearchForACauseSellModal).first()
    expect(modal.prop('open')).toBe(true)
    expect(modal.prop('hardSell')).toBe(true)

    expect(wrapper.find(SearchForACauseSellNotification).exists()).toBe(true)

    const acceptButton = wrapper
      .find(SearchForACauseSellModal)
      .find(Button)
      .at(1)
    expect(acceptButton.text()).toEqual("Let's Do It!")
    acceptButton.simulate('click')
    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(
      'Great! You can always switch your search engine here later on.'
    )
    expect(wrapper.find(SearchForACauseSellNotification).exists()).toBe(false)
  })

  it('displays tooltip when in v2 experiment and clicking on SearchInput with no searches', () => {
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          showYahooPrompt: false,
          searches: 0,
          features: [
            {
              featureName: YAHOO_SEARCH_NEW_USERS_V2,
              variation: 'Tooltip',
            },
          ],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(
      'You can switch your search engine here.'
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      HAS_SEEN_SEARCH_V2_TOOLTIP,
      true
    )
  })

  it('does not display tooltip when in v2 experiment and seen tooltip before per local storage', () => {
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          showYahooPrompt: false,
          searches: 0,
          features: [
            {
              featureName: YAHOO_SEARCH_NEW_USERS_V2,
              variation: 'Tooltip',
            },
          ],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue(true)
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(false)
  })

  it('does not display tooltip when in v2 experiment and clicking on SearchInput with searches', () => {
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          showYahooPrompt: false,
          features: [
            {
              featureName: YAHOO_SEARCH_NEW_USERS_V2,
              variation: 'Tooltip',
            },
          ],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(false)
  })

  it('does not display tooltip when in v2 experiment and clicking on SearchInput with non-tooltip variation', () => {
    const IndexPage = require('src/pages/index').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      data: {
        ...defaultMockProps.data,
        user: {
          ...defaultMockProps.data.user,
          showYahooPrompt: false,
          searches: 0,
          features: [
            {
              featureName: YAHOO_SEARCH_NEW_USERS_V2,
              variation: 'Notification',
            },
          ],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)

    act(() => {
      wrapper.find(SearchInput).first().prop('onSearchInputClick')()
    })
    wrapper.update()

    expect(wrapper.find(SearchInput).first().prop('tooltip')).toEqual(false)
  })

  it('shows a "supporting" chip that links to the "about the cause" page', () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)
    const elem = wrapper.find(Chip)
    expect(elem.prop('label')).toEqual('Supporting: Example Cause')
    elem.simulate('click')
    expect(goTo).toHaveBeenCalledWith(aboutURL)
  })
})

describe('index.js: hardcoded notifications', () => {
  beforeEach(() => {
    isClientSide.mockReturnValue(true)
  })

  it('does not render the college ambassador notification if it is not enabled', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    useData.mockReturnValue({ data: mockProps.data })
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).not.toBe(true)
  })

  it('does not render the college ambassador notification if it is enabled but user has already dismissed it', () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [{ code: 'collegeAmbassador2022' }],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue('true')
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).not.toBe(true)
  })

  it('does not render the college ambassador notification if not on the client side', async () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [{ code: 'collegeAmbassador2022' }],
        },
      },
    }
    isClientSide.mockReturnValue(false) // server side
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue(undefined)
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).toBe(false)
  })

  it('renders the user survey notification if user has not dismissed and it is enabled', async () => {
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [{ code: 'collegeAmbassador2022' }],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue(undefined)
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).toBe(true)
  })

  it('hides the college ambassador notification if it ends after initial render (this avoids "+1" problem of page loads after campaign end)', async () => {
    expect.assertions(2)
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [{ code: 'collegeAmbassador2022' }],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue(undefined)
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).toBe(true)

    wrapper.setProps({
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [], // ended
        },
      },
    })
    wrapper.update()
    expect(wrapper.find(Notification).at(1).exists()).toBe(false)
  })

  it('dismissing the college ambassador notification updates local storage and dismisses notification', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const mockProps = {
      ...getMockProps(),
      data: {
        ...getMockProps().data,
        user: {
          ...getMockProps().data.user,
          id: 'someId',
          username: 'someUsername',
          notifications: [{ code: 'collegeAmbassador2022' }],
        },
      },
    }
    useData.mockReturnValue({ data: mockProps.data })
    localStorageMgr.getItem.mockReturnValue(undefined)
    const wrapper = mount(<IndexPage {...mockProps} />)
    const notification = wrapper.find(Notification)
    notification.find(IconButton).simulate('click') // close icon
    await act(async () => {
      wrapper.update()
      flushAllPromises()
    })
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      AMBASSADOR_2022_NOTIFICATION,
      'true'
    )
  })
})
