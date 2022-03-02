import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CreateUserExperimentMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateUserExperimentMutation =
      require('src/utils/mutations/CreateUserExperimentMutation').default
    await CreateUserExperimentMutation('some-user-id', 'some-experiment-id', 'some-variation-id')
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          experimentId: 'some-experiment-id',
          variationId: 'some-variationId'
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const CreateUserExperimentMutation =
      require('src/utils/mutations/CreateUserExperimentMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await CreateUserExperimentMutation('some-user-id')
    expect(response).toEqual({ hi: 'there' })
  })
})
