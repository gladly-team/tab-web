jest.mock('src/components/UserBackgroundImage')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('UserBackgroundImage container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const UserBackgroundImage =
      require('src/components/UserBackgroundImage').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/UserBackgroundImageContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      UserBackgroundImage,
      expect.any(Object)
    )
  })
})
