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
    await CreateUserExperimentMutation({
      userId: 'some-user-id',
      experimentId: 'some-experiment-id',
      variationId: 2,
      variationValueStr: 'true',
    })
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          experimentId: 'some-experiment-id',
          variationId: 2,
          variationValueStr: 'true',
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
