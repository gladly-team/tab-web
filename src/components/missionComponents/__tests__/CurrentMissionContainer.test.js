jest.mock('src/components/missionComponents/CurrentMission')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('UserBackgroundImage container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const UserBackgroundImage = require('src/components/MissionComponents/CurrentMission')
      .default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/MissionComponents/CurrentMissionContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      UserBackgroundImage,
      expect.any(Object)
    )
  })
})
