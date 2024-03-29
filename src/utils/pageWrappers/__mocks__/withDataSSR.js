const withDataSSR = jest.fn(
  () => (getServerSidePropsFunc) => (ctx) =>
    typeof getServerSidePropsFunc === 'function'
      ? getServerSidePropsFunc(ctx)
      : undefined
)
export default withDataSSR
