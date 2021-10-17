import { createTheme } from '@material-ui/core/styles'
import { deepmerge } from '@material-ui/utils'

// const seasPrimaryColor = '#5094FB'
// const seassecondaryColor = '#29BEBA'
const defaultPrimaryColor = '#9d4ba3'
const defaultSecondaryColor = '#4a90e2'
const theme = createTheme({
  palette: {
    primary: {
      main: defaultPrimaryColor,
      contrastText: '#fff',
      background: 'rgba(157, 75, 163, 0.08)',
    },
    secondary: {
      main: defaultSecondaryColor,
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

const customTheme = ({ primaryColor, secondaryColor }) =>
  createTheme({
    palette: {
      primary: {
        main: primaryColor || defaultPrimaryColor,
        contrastText: '#fff',
        background: 'rgba(157, 75, 163, 0.08)',
      },
      secondary: {
        main: secondaryColor || defaultSecondaryColor,
        contrastText: '#fff',
      },
    },
  })

export const themeMapper = ({ primaryColor, secondaryColor }) =>
  createTheme(deepmerge(theme, customTheme({ primaryColor, secondaryColor })))
