import { createMuiTheme } from '@material-ui/core/styles'
import { merge } from 'lodash/object'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9d4ba3',
      contrastText: '#fff',
      background: 'rgba(157, 75, 163, 0.08)',
    },
    secondary: {
      main: '#4a90e2',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.80)',
    },
    colors: {
      purple1: '#9B51E0',
    },
    // this is a custom theme palette color for the index page
    backgroundContrastText: {
      main: 'rgba(0, 0, 0, 0.80)',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  shape: {
    borderRadius: 2,
  },
})

export default theme

export const extendTheme = (primaryTheme, extendedTheme) =>
  createMuiTheme(merge({}, primaryTheme, extendedTheme))
