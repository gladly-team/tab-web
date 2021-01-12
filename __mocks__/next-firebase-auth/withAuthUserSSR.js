const withAuthUserSSR = jest.fn(() => (getServerSidePropsFunc) => (ctx) =>
  getServerSidePropsFunc(ctx)
)
export default withAuthUserSSR
