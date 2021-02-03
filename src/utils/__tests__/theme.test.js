import Theme, { extendTheme } from 'src/utils/theme'
import BackgroundActiveTheme from 'src/utils/styles/backgroundImageActiveTheme'
jest.mock('@material-ui/core/styles', () => ({
  createMuiTheme: (theme) => theme,
}))
// Note the jest-environment docstring at the top of this file.
describe('merging themes', () => {
  it('returns the original theme if the extended theme is empty', () => {
    const theme = extendTheme(Theme, {})
    expect(theme).toEqual(Theme)
  })

  it('correctly overrides and extends certain fields in palette', () => {
    const theme = extendTheme(Theme, BackgroundActiveTheme)
    expect(theme).toEqual({
      palette: {
        primary: { main: '#9d4ba3', contrastText: '#fff' },
        secondary: { main: '#4a90e2', contrastText: '#fff' },
        text: { primary: '#fff' },
        action: { active: '#fff' },
      },
      typography: {
        fontSize: 14,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      },
      shape: { borderRadius: 2 },
    })
  })

  it('correctly overrides and extends certain fields in typography', () => {
    const theme = extendTheme(Theme, {
      typography: { fontSize: 25, color: 'blue' },
    })
    expect(theme).toEqual({
      palette: {
        primary: { main: '#9d4ba3', contrastText: '#fff' },
        secondary: { main: '#4a90e2', contrastText: '#fff' },
        text: { primary: 'rgba(0, 0, 0, 0.80)' },
        action: { active: 'rgba(0, 0, 0, 0.70)' },
      },
      typography: {
        fontSize: 25,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: 'blue',
      },
      shape: { borderRadius: 2 },
    })
  })

  it('correctly overrides and extends certain fields in shape', () => {
    const theme = extendTheme(Theme, {
      shape: { fontSize: 25, color: 'blue' },
    })
    expect(theme).toEqual({
      palette: {
        primary: { main: '#9d4ba3', contrastText: '#fff' },
        secondary: { main: '#4a90e2', contrastText: '#fff' },
        text: { primary: 'rgba(0, 0, 0, 0.80)' },
        action: { active: 'rgba(0, 0, 0, 0.70)' },
      },
      typography: {
        fontSize: 14,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      },
      shape: { borderRadius: 2, color: 'blue', fontSize: 25 },
    })
  })
})
