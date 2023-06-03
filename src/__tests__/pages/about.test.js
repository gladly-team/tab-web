import React from 'react'
import { shallow, mount } from 'enzyme'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import SettingsPage from 'src/components/SettingsPage'
import AboutTheCause from 'src/components/AboutTheCause'
import { CAUSE_IMPACT_TYPES } from 'src/utils/constants'
import ImpactMetricList from 'src/components/groupImpactComponents/ImpactMetricList'
import AboutTheNonprofit from 'src/components/groupImpactComponents/AboutTheNonprofit'

jest.mock('src/components/SettingsPage')
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/pageWrappers/withGoogleAnalyticsProperties')
jest.mock('src/utils/hooks/useData')
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/pageWrappers/CustomThemeHOC')
jest.mock('src/utils/hooks/useCustomTheming')

const getMockDataResponse = () => ({
  user: {
    id: 'some-user-id',
    email: 'fakeEmail@example.com',
    username: 'IAmFake',
    cause: {
      about: '### Something Here\n\nWith some other content.',
      impactType: CAUSE_IMPACT_TYPES.individual,
      theme: {
        primaryColor: '#FF0000',
        secondaryColor: 'CCC',
      },
      charities: [
        {
          id: 'charity-id',
          name: 'Charity',
          image:
            'https://dev-tab2017-media.gladly.io/img/charities/charity-post-donation-images/bwhi.jpg',
          longformDescription: `Partners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.

    They draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.
    
    When their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.
    
    Partners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.`,
          website: 'https://www.pih.org/',
          impactMetrics: [
            {
              id: 'nQUobFEFe',
              charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
              dollarAmount: 5e6, // $5
              impactTitle:
                'Provide 1 home visit from a community health worker',
              metricTitle: '1 home visit',
              description:
                'Living in the communities in which they work, community health workers are trusted neighbors who know their community best and use their linguistic, cultural, and technical expertise.\n\nThis provides access to care for people who might not otherwise have it.',
              whyValuableDescription:
                'Community health workers provide quality health care to those who might not otherwise have access.',
              active: false,
              impactCountPerMetric: 3,
            },
            {
              id: 'mhwYA7KbK',
              charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
              dollarAmount: 60e6, // $60
              impactTitle: 'Provide prenatal care for one woman',
              metricTitle: 'prenatal care',
              description:
                'Provide prenatal care to one impoverished mother-to-be--and ensure her pregnancy stays safe.',
              whyValuableDescription:
                'This prenatal care helps ensure a safe pregnancy for an impoverished mother-to-be.',
              active: false,
              impactCountPerMetric: 3,
            },
          ],
        },
      ],
      landingPagePath: '/foo',
    },
  },
})

const getMockProps = () => ({})

beforeEach(() => {
  useData.mockReturnValue({ data: undefined })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('about.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AboutPage = require('src/pages/about').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AboutPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns a SettingsPage component', () => {
    expect.assertions(1)
    const AboutPage = require('src/pages/about').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)
    expect(wrapper.at(0).type()).toEqual(SettingsPage)
  })

  it('passes the expected initial data to `useData`', () => {
    expect.assertions(1)
    const AboutPage = require('src/pages/about').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockDataResponse(), some: 'stuff' },
    }
    shallow(<AboutPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    expect(useDataArg).toMatchObject({
      fallbackData: mockProps.data,
    })
  })

  it('passes the expected getRelayQuery function to `useData`', async () => {
    expect.assertions(1)
    const AboutPage = require('src/pages/about').default
    const mockProps = getMockProps()
    shallow(<AboutPage {...mockProps} />)
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
    const AboutPage = require('src/pages/about').default
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
    mount(<AboutPage {...mockProps} />)
    expect(setTheme).toHaveBeenCalledWith({
      primaryColor: '#00FF00',
      secondaryColor: 'DEDEDE',
    })
  })

  it('does not render any child content when the fetch is still in progress', () => {
    expect.assertions(1)
    const AboutPage = require('src/pages/about').default
    useData.mockReturnValue({ data: undefined })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)
    expect(wrapper.find(SettingsPage).children().length).toEqual(0)
  })

  it('renders cause content within a AboutTheCause component when the fetch has completed', () => {
    expect.assertions(2)
    const AboutPage = require('src/pages/about').default
    const data = getMockDataResponse()
    useData.mockReturnValue({ data })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)
    expect(wrapper.find(SettingsPage).children().length).toBeGreaterThan(0)
    expect(wrapper.find(AboutTheCause).prop('cause')).toEqual(data.user.cause)
  })

  it('does not render group impact specific content if impact type is not group', () => {
    expect.assertions(2)
    const AboutPage = require('src/pages/about').default
    const data = getMockDataResponse()
    useData.mockReturnValue({ data })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)

    expect(wrapper.find(AboutTheNonprofit).length).toEqual(0)
    expect(wrapper.find(ImpactMetricList).length).toEqual(0)
  })

  it('renders group impact specific content if impact type is group', () => {
    expect.assertions(5)
    const AboutPage = require('src/pages/about').default
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          cause: {
            ...defaultMockData.user.cause,
            impactType: CAUSE_IMPACT_TYPES.group,
          },
        },
      },
    })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)

    const aboutTheNonprofit = wrapper.find(AboutTheNonprofit)
    expect(aboutTheNonprofit.length).toEqual(1)
    expect(aboutTheNonprofit.at(0).prop('charities')).toEqual(
      defaultMockData.user.cause.charities
    )
    const impactMetricList = wrapper.find(ImpactMetricList)
    expect(impactMetricList.length).toEqual(1)
    expect(impactMetricList.at(0).prop('impactMetrics')).toEqual(
      defaultMockData.user.cause.charities[0].impactMetrics.map((val) => {
        const copy = { ...val }
        copy.charityName = defaultMockData.user.cause.charities[0].name
        return copy
      })
    )
    const aboutTheCause = wrapper.find(AboutTheCause)
    expect(aboutTheCause.exists()).toBe(false)
  })

  it('renders group impact specific content if impact type is group_and_individual', () => {
    expect.assertions(5)
    const AboutPage = require('src/pages/about').default
    const defaultMockData = getMockDataResponse()
    useData.mockReturnValue({
      data: {
        ...defaultMockData,
        user: {
          ...defaultMockData.user,
          cause: {
            ...defaultMockData.user.cause,
            impactType: CAUSE_IMPACT_TYPES.individual_and_group,
          },
        },
      },
    })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)

    const aboutTheNonprofit = wrapper.find(AboutTheNonprofit)
    expect(aboutTheNonprofit.length).toEqual(1)
    expect(aboutTheNonprofit.at(0).prop('charities')).toEqual(
      defaultMockData.user.cause.charities
    )
    const impactMetricList = wrapper.find(ImpactMetricList)
    expect(impactMetricList.length).toEqual(1)
    expect(impactMetricList.at(0).prop('impactMetrics')).toEqual(
      defaultMockData.user.cause.charities[0].impactMetrics.map((val) => {
        const copy = { ...val }
        copy.charityName = defaultMockData.user.cause.charities[0].name
        return copy
      })
    )
    const aboutTheCause = wrapper.find(AboutTheCause)
    expect(aboutTheCause.exists()).toBe(false)
  })
})
