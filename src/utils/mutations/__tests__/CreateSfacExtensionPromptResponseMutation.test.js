import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

const userId = 'some-user-id'
const accepted = true
const browser = 'chrome'

describe('CreateSfacExtensionPromptResponseMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateSfacExtensionPromptResponseMutation =
      require('src/utils/mutations/CreateSfacExtensionPromptResponseMutation').default
    await CreateSfacExtensionPromptResponseMutation(userId, browser, accepted)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId,
          accepted,
          browser,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const CreateSfacExtensionPromptResponseMutation =
      require('src/utils/mutations/CreateSfacExtensionPromptResponseMutation').default
    callMutation.mockResolvedValue({
      user: {
        showSfacExtensionPrompt: false,
      },
    })
    const response = await CreateSfacExtensionPromptResponseMutation(
      userId,
      browser,
      accepted
    )
    expect(response).toEqual({
      user: {
        showSfacExtensionPrompt: false,
      },
    })
  })
})
