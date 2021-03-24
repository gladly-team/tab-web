import logger from 'src/utils/logger'

// A top level server side wrapper that catches all errors in the getServerSideProps func
// and logs them through our logger
const logUncaughtErrors = (getServerSidePropsFunc) => async (ctx) => {
  let composedProps = { props: {} }
  try {
    if (getServerSidePropsFunc) {
      composedProps = await getServerSidePropsFunc(ctx)
    }
  } catch (e) {
    logger.error(e)
    throw e
  }
  return composedProps
}

export default logUncaughtErrors
