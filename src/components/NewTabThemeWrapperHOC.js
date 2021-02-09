/* eslint-disable react/jsx-props-no-spreading */
import {
  createMuiTheme,
  ThemeProvider,
  useTheme,
} from '@material-ui/core/styles'
import React, { useState, useMemo } from 'react'
import { extendTheme } from 'src/utils/theme'
import BackgroundImageActiveTheme from 'src/utils/styles/backgroundImageActiveTheme'
import { showBackgroundImages } from 'src/utils/featureFlags'

const NewTabThemeWrapper = (Component) =>
  function ThemeComponent(props) {
    const [enableBackgroundImages] = useState(showBackgroundImages())
    const defaultTheme = useTheme()
    const theme = useMemo(
      () =>
        createMuiTheme(
          extendTheme(
            defaultTheme,
            enableBackgroundImages === true ? BackgroundImageActiveTheme : {}
          )
        ),
      [enableBackgroundImages, defaultTheme]
    )
    return (
      <ThemeProvider theme={theme}>
        <Component {...props} />
      </ThemeProvider>
    )
  }

export default NewTabThemeWrapper
