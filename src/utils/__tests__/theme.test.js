import { themeMapper } from '../theme'

describe('Tests theme functions', () => {
  it('merges the default theme and the custom theme', () => {
    const customTheme = themeMapper({
      primaryColor: '#5094FB',
      secondayColor: '#29BEBA',
    })
    expect(customTheme.palette.primary.main).toEqual('#5094FB')
    expect(customTheme.palette.secondary.main).toEqual('#29BEBA')
  })
})
