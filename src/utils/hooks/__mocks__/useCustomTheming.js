const useThemeHook = jest.fn()
const useCustomThemingMock = jest.fn(() => useThemeHook)

export default useCustomThemingMock
