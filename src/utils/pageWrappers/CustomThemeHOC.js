/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import { CustomThemingContext } from 'src/utils/hooks/useCustomTheming'
import { themeMapper } from 'src/utils/theme'
import grey from '@material-ui/core/colors/grey'

const CustomThemeHOC = (Component) =>
  function ThemeComponent(props) {
    // The user's data might have cause-specific theming.
    const causeTheme = get(props, 'data.user.cause.theme', {})
    const {
      primaryColor: primaryColorFromData,
      secondaryColor: secondaryColorFromData,
    } = causeTheme

    // Any theme property customizations set from within child components
    // via a `setCustomTheme` hook.
    const [themeModsFromChildren, setThemeModsFromChildren] = useState({})
    const customThemeContextVal = useMemo(
      () => (themeMod) => setThemeModsFromChildren(themeMod),
      []
    )
    const primaryColorFromChildren = get(themeModsFromChildren, 'primaryColor')
    const secondaryColorFromChildren = get(
      themeModsFromChildren,
      'secondaryColor'
    )

    // Customizations set by children take preference.
    // When using this component, we expect custom theming to be set,
    // either above via server-side data or via the `setCustomTheming`
    // hook. So, default to neutral grey colors before the custom
    // theming is set.
    const primaryColor =
      primaryColorFromChildren || primaryColorFromData || grey['500']
    const secondaryColor =
      secondaryColorFromChildren || secondaryColorFromData || grey['300']

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
        theme={(outerTheme) =>
          createTheme({
            ...outerTheme,
            palette: {
              ...outerTheme.palette,

              // TODO: dark mode. Requires full SSR support.
              // https://mui.com/material-ui/customization/dark-mode/
              // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
              // https://github.com/WICG/user-preference-media-features-headers
              // Maybe a library like this is helpful:
              // https://github.com/pacocoursey/next-themes
              primary: {
                // Explicitly leave off "dark" and "light" properties
                // so that they're reset based on the custom "main" color.
                main: outerTheme.palette.primary.main,
                ...get(themeModifications, 'palette.primary', {}),
              },
              secondary: {
                // Explicitly leave off "dark" and "light" properties
                // so that they're reset based on the custom "main" color.
                main: outerTheme.palette.secondary.main,
                ...get(themeModifications, 'palette.secondary', {}),
              },
            },
          })
        }
      >
        <CustomThemingContext.Provider value={customThemeContextVal}>
          <Component {...props} />
        </CustomThemingContext.Provider>
      </ThemeProvider>
    )
  }

CustomThemeHOC.displayName = 'CustomThemeHOC'

export default CustomThemeHOC
