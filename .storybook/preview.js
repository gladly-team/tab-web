import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import CssBaseline from '@material-ui/core/CssBaseline'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'

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
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Story />
      </CssBaseline>
    </ThemeProvider>
  ),
]
