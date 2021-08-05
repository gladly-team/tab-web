import { ThemeProvider } from '@material-ui/core/styles'
import { RouterContext } from 'next/dist/next-server/lib/router-context' // next < 11.2
import theme from 'src/utils/theme'
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
]
