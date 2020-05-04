import React from 'react'
import { shallow } from 'enzyme'
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
})
