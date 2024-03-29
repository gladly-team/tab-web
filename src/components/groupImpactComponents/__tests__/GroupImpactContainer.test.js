jest.mock('src/components/groupImpactComponents/GroupImpact')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

// Disabling until resolving memory/deploy issues.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('GroupImpact container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/groupImpactComponents/GroupImpactContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      GroupImpact,
      expect.any(Object)
    )
  })
})
