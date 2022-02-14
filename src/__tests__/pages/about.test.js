import React from 'react'
import { shallow, mount } from 'enzyme'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import SettingsPage from 'src/components/SettingsPage'
import Markdown from 'src/components/Markdown'

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
      theme: {
        primaryColor: '#FF0000',
        secondaryColor: 'CCC',
      },
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

  it('renders child content within a Markdown component when the fetch has completed', () => {
    expect.assertions(2)
    const AboutPage = require('src/pages/about').default
    useData.mockReturnValue({ data: getMockDataResponse() })
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutPage {...mockProps} />)
    expect(wrapper.find(SettingsPage).children().length).toBeGreaterThan(0)
    expect(wrapper.find(Markdown).prop('children')).toEqual(
      '### Something Here\n\nWith some other content.'
    )
  })
})
