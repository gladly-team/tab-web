import React from 'react'
import { shallow } from 'enzyme'
import Link from 'src/components/Link'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import { accountURL } from 'src/utils/urls'
// import { AdComponent, fetchAds } from 'tab-ads'
// import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'
// import { getHostname, getCurrentURL } from 'src/utils/navigation'
// import {
//   getAdUnits,
//   areAdsEnabled,
//   showMockAds,
//   isInEuropeanUnion,
// } from 'src/utils/adHelpers'
// import { isClientSide } from 'src/utils/ssr'
// import Logo from 'src/components/Logo'
// import MoneyRaisedContainer from 'src/components/MoneyRaisedContainer'
// import SearchInput from 'src/components/SearchInput'

jest.mock('tab-ads')
jest.mock('@material-ui/icons/Settings')
jest.mock('src/components/Link')
jest.mock('src/utils/pageWrappers/withAuthAndData')
jest.mock('src/utils/navigation')
jest.mock('src/utils/adHelpers')
jest.mock('src/utils/ssr')
jest.mock('src/components/Logo')
jest.mock('src/components/MoneyRaisedContainer')
jest.mock('src/components/SearchInput')

const getMockProps = () => ({
  app: {},
  user: {
    tabs: 221,
    vcCurrent: 78,
  },
})

describe('index.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const IndexPage = require('src/containers/index').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<IndexPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes a settings icon link to the account page', () => {
    expect.assertions(1)
    const IndexPage = require('src/containers/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    const settingsLink = wrapper
      .find(Link)
      .filterWhere(el => el.prop('to') === accountURL)
    expect(settingsLink.exists()).toBe(true)
  })

  it('uses an settings icon button to link to the account page', () => {
    expect.assertions(2)
    const IndexPage = require('src/containers/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<IndexPage {...mockProps} />)
    const settingsLink = wrapper
      .find(Link)
      .filterWhere(el => el.prop('to') === accountURL)
    expect(settingsLink.childAt(0).type()).toEqual(IconButton)
    expect(
      settingsLink
        .childAt(0)
        .childAt(0)
        .type()
    ).toEqual(SettingsIcon)
  })
})
