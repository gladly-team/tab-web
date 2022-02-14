import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

const switched = true
const searchEnginePrompted = 'Google'
const userId = 'some-user-id'

describe('CreateSearchEnginePromptLogMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateSearchEnginePromptLogMutation =
      require('src/utils/mutations/CreateSearchEnginePromptLogMutation').default
    await CreateSearchEnginePromptLogMutation(
      userId,
      searchEnginePrompted,
      switched
    )
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId,
          searchEnginePrompted,
          switched,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const CreateSearchEnginePromptLogMutation =
      require('src/utils/mutations/CreateSearchEnginePromptLogMutation').default
    callMutation.mockResolvedValue({
      success: true,
    })
    const response = await CreateSearchEnginePromptLogMutation(
      userId,
      searchEnginePrompted,
      switched
    )
    expect(response).toEqual({
      success: true,
    })
  })
})
