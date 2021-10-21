import React from 'react'
import { mount } from 'enzyme'
import { flowRight } from 'lodash/util'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import defaultTheme from 'src/utils/theme'
import CustomThemeHOC from '../CustomThemeHOC'

describe('CustomThemeHOC', () => {
  it('renders without error', () => {
    const standardTheme = createTheme(defaultTheme)
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([CustomThemeHOC])(DummyComponent)
    expect(() => {
      mount(
        <ThemeProvider theme={standardTheme}>
          <WrappedHOC />
        </ThemeProvider>
      )
    }).not.toThrow()
  })
})
