jest.mock('src/components/InviteFriendsIcon')

describe('InviteFriendsIcon container', () => {
  it('wraps the correct component', () => {
    const { createFragmentContainer } = require('react-relay')
    const InviteFriendsIcon =
      require('src/components/InviteFriendsIcon').default
    // eslint-disable-next-line no-unused-expressions
    require('src/components/InviteFriendsIconContainer').default
    expect(createFragmentContainer).toHaveBeenCalledWith(
      InviteFriendsIcon,
      expect.any(Object)
    )
  })
})
