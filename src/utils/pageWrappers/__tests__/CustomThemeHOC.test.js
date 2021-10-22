import React from 'react'
import { mount } from 'enzyme'
import { flowRight } from 'lodash/util'
import { ThemeProvider, createTheme, useTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
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

  it('provides the expected MUI theme to the children', () => {
    const standardTheme = createTheme(defaultTheme)
    const expectedTheme = createTheme({
      ...standardTheme,
      palette: {
        ...standardTheme.palette,
        primary: {
          main: grey['500'],
        },
        secondary: {
          main: grey['300'],
        },
      },
    })
    let themeInChild
    const DummyComponent = () => {
      themeInChild = useTheme()
      return null
    }
    const WrappedHOC = flowRight([CustomThemeHOC])(DummyComponent)
    mount(
      <ThemeProvider theme={standardTheme}>
        <WrappedHOC />
      </ThemeProvider>
    )
    expect(themeInChild).toMatchObject(expectedTheme)
  })
})
