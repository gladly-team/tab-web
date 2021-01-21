import React from 'react'
import { shallow } from 'enzyme'
import Link from 'src/components/Link'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import { accountURL } from 'src/utils/urls'
import { showMockAchievements } from 'src/utils/featureFlags'
import Achievement from 'src/components/Achievement'
import FullPageLoader from 'src/components/FullPageLoader'
import useData from 'src/utils/hooks/useData'

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
  useData.mockReturnValue({ data: getMockProps().data })
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
