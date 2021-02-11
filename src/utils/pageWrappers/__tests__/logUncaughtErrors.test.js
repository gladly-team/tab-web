import logUncaughtErrors from 'src/utils/pageWrappers/logUncaughtErrors'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import logger from 'src/utils/logger'

jest.mock('react-relay')
jest.mock('src/utils/relayEnvironment')
jest.mock('src/utils/logger', () => ({
  error: jest.fn(),
}))

const getMockCtxWithAuthUser = () => ({
  ...getMockNextJSContext(),
  AuthUser: getMockAuthUser(),
})
jest.mock('next-firebase-auth', () => ({
  useAuthUser: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('logUncaughtErrors', () => {
  it('catches any error in server side prop function and passes it to the logger', async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsErrorFunc = async () => {
      throw new Error('ahhh error')
    }
    await logUncaughtErrors(serverSidePropsErrorFunc)(ctx)
    expect(logger.error).toHaveBeenCalled()
  })

  it("doesn't throw the caught error", async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsErrorFunc = async () => {
      throw new Error('ahhh error')
    }
    await logUncaughtErrors(serverSidePropsErrorFunc)(ctx)
    expect(logUncaughtErrors).not.toThrow()
  })

  it('returns the composed props from server side function', async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsFunc = async () => ({
      sillyProp: 'sillyProp',
    })
    const composedProps = await logUncaughtErrors(serverSidePropsFunc)(ctx)
    expect(composedProps).toStrictEqual({ sillyProp: 'sillyProp' })
  })
})
