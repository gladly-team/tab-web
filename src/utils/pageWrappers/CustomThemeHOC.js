/* eslint-disable react/jsx-props-no-spreading */
// import React, { useState, useMemo } from 'react'
import React, { useMemo } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import { ThemeContext } from 'src/utils/hooks/useThemeContext'
import { themeMapper } from 'src/utils/theme'

const CustomThemeHOC = (Component) =>
  function ThemeComponent(props) {
    // The user's data might have cause-specific theming.
    const causeTheme = get(props, 'data.user.cause.theme', {})
    const { primaryColor, secondaryColor } = causeTheme

    // console.log('props', props)
    // console.log('causeTheme', causeTheme)

    // Any theme property customizations set from within child components.
    // const [themeModifications, setThemeModifications] = useState({})

    // Can probably remove this and rely only on HOC for now (?).
    // Provide a `setTheme` function via context.
    const customThemeContextVal = useMemo(
      () => ({
        // setTheme: (themeMod) => setThemeModifications(themeMapper(themeMod)),
        setTheme: () => {}, // noop
      }),
      []
    )

    const themeModifications = useMemo(
      () =>
        themeMapper({
          primaryColor,
          secondaryColor,
        }),
      [primaryColor, secondaryColor]
    )

    // eslint-disable-next-line no-console
    console.log('themeModifications', themeModifications)

    return (
      <ThemeProvider
        theme={(outerTheme) => ({
          ...outerTheme,
          palette: {
            ...outerTheme.palette,
            primary: {
              ...outerTheme.palette.primary,
              ...get(themeModifications, 'palette.primary', {}),
            },
            secondary: {
              ...outerTheme.palette.secondary,
              ...get(themeModifications, 'palette.secondary', {}),
            },
          },
        })}
      >
        <ThemeContext.Provider value={customThemeContextVal}>
          <Component {...props} />
        </ThemeContext.Provider>
      </ThemeProvider>
    )
  }

CustomThemeHOC.displayName = 'CustomThemeHOC'

export default CustomThemeHOC
