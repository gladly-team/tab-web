import { createTheme } from '@material-ui/core/styles'
import { merge } from 'lodash/object'
import { TAB_FOR_TEAMSEAS_CAUSE_ID } from 'src/utils/constants'

const theme = createTheme({
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
      backgroundGrey: '#E5E5E5',
      subtitleGrey: '#828282',
      disabledGrey: '#BDBDBD',
      blue1: '#6EA6E7',
    },

    // this is a custom theme palette color for the index page
    backgroundContrastText: {
      main: '#fff',
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

const seasTheme = createTheme({
  primary: {
    main: '#5094FB',
    contrastText: '#fff',
    background: 'rgba(157, 75, 163, 0.08)',
  },
  secondary: {
    main: '#29BEBA',
    contrastText: '#fff',
  },
})

export const extendTheme = (primaryTheme, extendedTheme) =>
  createTheme(merge({}, primaryTheme, extendedTheme))

export const themeMapper = (causeId) => {
  switch (causeId) {
    case TAB_FOR_TEAMSEAS_CAUSE_ID:
      return extendTheme(theme, seasTheme)
    default:
      return theme
  }
}
