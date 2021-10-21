import { useContext, createContext } from 'react'

export const CustomThemingContext = createContext(
  () => {} // // `setCustomTheming` function. State managed in CustomThemeHOC.js.
)
const useThemeContext = () => useContext(CustomThemingContext)
export default useThemeContext
