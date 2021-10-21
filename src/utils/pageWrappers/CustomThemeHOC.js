/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import { ThemeContext } from 'src/utils/hooks/useThemeContext'
import { themeMapper } from 'src/utils/theme'

const CustomThemeHOC = (Component) =>
  function ThemeComponent(props) {
    // The user's data might have cause-specific theming.
    const causeTheme = get(props, 'data.user.cause.theme', {})
    const { primaryColorFromData, secondaryColorFromData } = causeTheme

    // Any theme property customizations set from within child components
    // via a `setCustomTheme` hook.
    const [themeModsFromChildren, setThemeModsFromChildren] = useState({})
    const customThemeContextVal = useMemo(
      () => ({
        setTheme: (themeMod) => setThemeModsFromChildren(themeMod),
      }),
      []
    )
    const primaryColorFromChildren = get(themeModsFromChildren, 'primaryColor')
    const secondaryColorFromChildren = get(
      themeModsFromChildren,
      'secondaryColor'
    )

    // Customizations set by children take preference.
    const primaryColor = primaryColorFromChildren || primaryColorFromData
    const secondaryColor = secondaryColorFromChildren || secondaryColorFromData
    const themeModifications = useMemo(
      () =>
        themeMapper({
          primaryColor,
          secondaryColor,
        }),
      [primaryColor, secondaryColor]
    )

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
