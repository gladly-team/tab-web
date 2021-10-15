import { useContext, createContext } from 'react'

export const ThemeContext = createContext({
  theme: {},
  setTheme: () => {},
})
export const useThemeContext = () => useContext(ThemeContext)
