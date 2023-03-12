import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import { install } from 'ga-gtag'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/900.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => {
    install('G-LDFLQCKVHG')
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Story />
        </CssBaseline>
      </ThemeProvider>
    )
  },
]
