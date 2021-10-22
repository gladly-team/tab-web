import React, { useEffect } from 'react'
import { mount } from 'enzyme'
import { flowRight } from 'lodash/util'
import { ThemeProvider, createTheme, useTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import defaultTheme from 'src/utils/theme'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
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

  it('provides a modified MUI theme to children when provided cause.theme data', () => {
    const data = {
      user: {
        cause: {
          theme: {
            primaryColor: '#FF0000',
            secondaryColor: '#CECECE',
          },
        },
      },
    }
    const standardTheme = createTheme(defaultTheme)
    const expectedTheme = createTheme({
      ...standardTheme,
      palette: {
        ...standardTheme.palette,
        primary: {
          main: '#FF0000',
        },
        secondary: {
          main: '#CECECE',
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
        <WrappedHOC data={data} />
      </ThemeProvider>
    )
    expect(themeInChild).toMatchObject(expectedTheme)
  })

  it('provides a modified MUI theme to children when a child sets the custom theme', () => {
    const data = {}
    const standardTheme = createTheme(defaultTheme)
    const expectedTheme = createTheme({
      ...standardTheme,
      palette: {
        ...standardTheme.palette,
        primary: {
          main: '#DEDEDE',
        },
        secondary: {
          main: '#FFF',
        },
      },
    })
    let themeInChild
    const DummyComponent = () => {
      const setCustomTheme = useCustomTheming()
      useEffect(() => {
        setCustomTheme({ primaryColor: '#DEDEDE', secondaryColor: '#FFF' })
      }, [setCustomTheme])
      themeInChild = useTheme()
      return null
    }
    const WrappedHOC = flowRight([CustomThemeHOC])(DummyComponent)
    mount(
      <ThemeProvider theme={standardTheme}>
        <WrappedHOC data={data} />
      </ThemeProvider>
    )
    expect(themeInChild).toMatchObject(expectedTheme)
  })

  it('uses theming from the child over theming from data when both are provided', () => {
    const data = {
      user: {
        cause: {
          theme: {
            primaryColor: '#FF0000',
            secondaryColor: '#CECECE',
          },
        },
      },
    }
    const standardTheme = createTheme(defaultTheme)
    const expectedTheme = createTheme({
      ...standardTheme,
      palette: {
        ...standardTheme.palette,
        primary: {
          main: '#DEDEDE',
        },
        secondary: {
          main: '#FFF',
        },
      },
    })
    let themeInChild
    const DummyComponent = () => {
      const setCustomTheme = useCustomTheming()
      useEffect(() => {
        setCustomTheme({ primaryColor: '#DEDEDE', secondaryColor: '#FFF' })
      }, [setCustomTheme])
      themeInChild = useTheme()
      return null
    }
    const WrappedHOC = flowRight([CustomThemeHOC])(DummyComponent)
    mount(
      <ThemeProvider theme={standardTheme}>
        <WrappedHOC data={data} />
      </ThemeProvider>
    )
    expect(themeInChild).toMatchObject(expectedTheme)
  })
})
