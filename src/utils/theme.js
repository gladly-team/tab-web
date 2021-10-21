import { createTheme } from '@material-ui/core/styles'

const TFAC_ORIGINAL_PURPLE = '#9d4ba3'
const TFAC_ORIGINAL_BLUE = '#4a90e2'
const defaultThemeObject = {
  palette: {
    primary: {
      main: TFAC_ORIGINAL_PURPLE,
      contrastText: '#fff',
      background: 'rgba(157, 75, 163, 0.08)',
    },
    secondary: {
      main: TFAC_ORIGINAL_BLUE,
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
}
const theme = createTheme(defaultThemeObject)

// Takes user-specific theme properties and creates a theme-like object
// that can be merged with a theme to create a nested theme.
export const themeMapper = ({ primaryColor, secondaryColor }) => ({
  palette: {
    primary: {
      main: primaryColor || TFAC_ORIGINAL_PURPLE,
    },
    secondary: {
      main: secondaryColor || TFAC_ORIGINAL_BLUE,
    },
  },
})

export default theme
