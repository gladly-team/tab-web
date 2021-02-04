import React from 'react'
import { shallow } from 'enzyme'
// import Page from '../../pages/index'
import { flowRight } from 'lodash/util'
import { showBackgroundImages } from 'src/utils/featureFlags'
import NewTabThemeWrapper from '../NewTabThemeWrapperHOC'

jest.mock('src/utils/featureFlags', () => ({
  showBackgroundImages: jest.fn(),
}))

describe('Achievement component', () => {
  it('renders without error', () => {
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([NewTabThemeWrapper])(DummyComponent)
    expect(() => {
      shallow(<WrappedHOC />)
    }).not.toThrow()
  })

  it('renders with a white text palette when background image is enabled', () => {
    showBackgroundImages.mockImplementation(() => true)
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([NewTabThemeWrapper])(DummyComponent)
    const testComponent = shallow(<WrappedHOC />)
    const themePassedIn = testComponent.props().theme
    expect(themePassedIn.palette.text.primary).toEqual('#fff')
  })

  it('renders with a black text palette when background image is disabled', () => {
    showBackgroundImages.mockImplementation(() => false)
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([NewTabThemeWrapper])(DummyComponent)
    const testComponent = shallow(<WrappedHOC />)
    const themePassedIn = testComponent.props().theme
    expect(themePassedIn.palette.text.primary).toEqual('rgba(0, 0, 0, 0.87)')
  })
})
