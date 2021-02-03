import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9d4ba3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4a90e2',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.80)',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.70)',
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
  createMuiTheme({
    // so you can add additional fields, idk if you'd ever want to
    // this will have to be modified if we add more things or if you want to extend just 
    // one field inside of say secondary but I believe it will handle most cases
    ...extendedTheme,
    palette: {
      ...primaryTheme.palette,
      ...extendedTheme.palette,
    },
    typography: {
      ...primaryTheme.typography,
      ...extendedTheme.typography,
    },
    shape: {
      ...primaryTheme.shape,
      ...extendedTheme.shape,
    },
  })
