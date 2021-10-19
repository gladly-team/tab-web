const withAuthUserTokenSSR = jest.fn(() => (getServerSidePropsFunc) => (ctx) =>
  getServerSidePropsFunc(ctx)
)
export default withAuthUserTokenSSR
