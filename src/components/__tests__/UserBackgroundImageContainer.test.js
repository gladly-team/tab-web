jest.mock('src/components/UserBackgroundImage')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

// TODO: we can probably create a test-util helper to
//   run a bunch of standard tests on container modules.
//   E.g., it would be nice to test the fetched data against
//   the module's prop-types.
// Will get to this when I have my legs under me a little more
describe('UserBackgroundImage container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/UserBackgroundImageContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      UserBackgroundImage,
      expect.any(Object)
    )
  })
})
