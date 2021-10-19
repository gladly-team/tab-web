import { themeMapper } from '../theme'

describe('Tests theme functions', () => {
  it('merges the default theme and the custom theme', () => {
    const customTheme = themeMapper({
      primaryColor: '#5094FB',
      secondaryColor: '#29BEBA',
    })
    expect(customTheme.palette.primary.main).toEqual('#5094FB')
    expect(customTheme.palette.secondary.main).toEqual('#29BEBA')
  })

  it('includes the default theme when not overwritten by custom theme', () => {
    const customTheme = themeMapper({
      primaryColor: '#5094FB',
      secondaryColor: '#29BEBA',
    })
    expect(customTheme.typography.fontSize).toEqual(14)
    expect(customTheme.shape.borderRadius).toEqual(2)
  })
})
