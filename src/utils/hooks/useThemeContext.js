import { useContext, createContext } from 'react'

// these are defaults.  These values are actually defined in _app.js
export const ThemeContext = createContext({
  theme: {},
  setTheme: () => {},
})
const useThemeContext = () => useContext(ThemeContext)
export default useThemeContext
