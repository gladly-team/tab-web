import { createTheme, alpha } from '@material-ui/core/styles'

const TFAC_ORIGINAL_PURPLE = '#9d4ba3'
const TFAC_ORIGINAL_BLUE = '#4a90e2'

const createBackgroundColor = (hex) => alpha(hex, 0.08)

const defaultThemeObject = {
  palette: {
    primary: {
      main: TFAC_ORIGINAL_PURPLE,
      contrastText: '#fff',

      // "background" is a custom prop
      background: createBackgroundColor(TFAC_ORIGINAL_PURPLE),
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
      shop: '#FF596F',
      search: '#4AB4B4',
      referral: '#5094FB',
      tab: TFAC_ORIGINAL_PURPLE,
    },

    // this is a custom theme palette color for the index page
    backgroundContrastText: {
      main: '#fff',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: 'Poppins',
    },
    h2: {
      fontFamily: 'Poppins',
    },
    h3: {
      fontFamily: 'Poppins',
    },
    h4: {
      fontFamily: 'Poppins',
    },
  },
  shape: {
    borderRadius: 12,
  },
  zIndex: {
    modal: 100000001,
  },
  overrides: {
    MuiAppBar: {
      root: {
        // Useful for when custom theming is set after load.
        transition: 'background-color 300ms',
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: '#29BEBA',
        '&:hover': {
          backgroundColor: '#1C8582',
        },
        color: 'white',
      },
      outlined: {
        borderColor: '#29BEBA',
        color: '#29BEBA',
      },
      root: {
        borderRadius: '9999px',
        fontFamily: 'Poppins',
      },
    },
  },
}
const theme = createTheme(defaultThemeObject)

// Takes user-specific theme properties and creates a theme-like object
// that can be merged with a theme to create a nested theme.
export const themeMapper = ({ primaryColor, secondaryColor }) => ({
  palette: {
    primary: {
      main: primaryColor || TFAC_ORIGINAL_PURPLE,
      background: createBackgroundColor(primaryColor || TFAC_ORIGINAL_PURPLE),
    },
    secondary: {
      main: secondaryColor || TFAC_ORIGINAL_BLUE,
    },
  },
})

export default theme
