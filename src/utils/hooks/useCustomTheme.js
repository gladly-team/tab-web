import React, { useState, useMemo } from 'react'
import { createTheme, ThemeProvider, useTheme } from '@material-ui/core/styles'
import { extendTheme } from 'src/utils/theme'
import BackgroundImageActiveTheme from 'src/utils/styles/backgroundImageActiveTheme'
import { showBackgroundImages } from 'src/utils/featureFlags'

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

const useCustomTheme = (charityId) => {
  const [enableBackgroundImages] = useState(showBackgroundImages())
  console.log(enableBackgroundImages)
  const defaultTheme = useTheme()
  const theme = useMemo(
    () =>
      createTheme(
        extendTheme(
          defaultTheme,
          enableBackgroundImages === true ? BackgroundImageActiveTheme : {}
        )
      ),
    [enableBackgroundImages, defaultTheme]
  )
  console.log(theme.palette.backgroundContrastText.main, 'theme')
  return ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
}

export default useCustomTheme
