// A wrapper for `getServerSideProps` that conditionally
// returns a 404.
const return404If = (should404) => (getServerSidePropsFunc) => async (ctx) => {
  if (should404) {
    return {
      // Returns the default 404 page and 404 status code.
      notFound: true,
    }
  }
  let props = {}
  if (getServerSidePropsFunc) {
    props = await getServerSidePropsFunc(ctx)
  }
  return {
    props,
  }
}

export default return404If
