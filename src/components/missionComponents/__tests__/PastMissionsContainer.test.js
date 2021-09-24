jest.mock('src/components/missionComponents/PastMissions')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('PastMissions container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const PastMissions =
      require('src/components/missionComponents/PastMissions').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/missionComponents/PastMissionsContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      PastMissions,
      expect.any(Object)
    )
  })
})
