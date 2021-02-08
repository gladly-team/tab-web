import React from 'react'
import { shallow } from 'enzyme'
import { flowRight } from 'lodash/util'
import { showBackgroundImages } from 'src/utils/featureFlags'
import NewTabThemeWrapper from '../NewTabThemeWrapperHOC'

jest.mock('src/utils/featureFlags', () => ({
  showBackgroundImages: jest.fn(),
}))

describe('Theme Wrapper HOC', () => {
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
    expect(themePassedIn.palette.backgroundContrastText.main).toEqual('#fff')
  })

  it('renders with a black text palette when background image is disabled', () => {
    showBackgroundImages.mockImplementation(() => false)
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([NewTabThemeWrapper])(DummyComponent)
    const testComponent = shallow(<WrappedHOC />)
    const themePassedIn = testComponent.props().theme
    // testing that
    expect(themePassedIn.palette.text.backgroundContrastText).toEqual(undefined)
  })
})
