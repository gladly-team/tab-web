import { GrowthBook } from '@growthbook/growthbook-react'
import CreateUserExperimentMutation from 'src/utils/mutations/CreateUserExperimentMutation'

jest.mock('@growthbook/growthbook-react')
jest.mock('src/utils/mutations/CreateUserExperimentMutation')

const mockAttributes = {
  id: 'test-user-id',
  env: 'test-env',
  causeId: 'test-cause-id',
  v4BetaEnabled: true,
  joined: true,
  isTabTeamMember: true,
}

describe('growthbook trackingCallback is correct with correct values', () => {
  it('runs trackingCallback correctly', () => {
    const sampleFeatures = {
      'test-experiment-feature': {
        rules: [
          {
            variations: ['variation-A', 'variation-B'],
            weights: [1.0, 0.0],
          },
        ],
      },
    }
    const growthbook = new GrowthBook()
    growthbook.setFeatures(sampleFeatures)
    growthbook.setAttributes(mockAttributes)

    growthbook.feature('test-experiment-feature')
    expect(CreateUserExperimentMutation).toHaveBeenCalledWith(
      'test-user-id',
      'test-experiment-feature',
      'variation-A'
    )
  })

  it('does not run trackingCallback if not experiment', () => {
    // todo: @jedtan figure out a way to use resetAllMocks
    CreateUserExperimentMutation.mockReset()
    const sampleFeatures = {
      'test-experiment-feature': {
        defaultValue: false,
      },
    }
    const growthbook = new GrowthBook()
    growthbook.setFeatures(sampleFeatures)
    growthbook.setAttributes(mockAttributes)

    growthbook.feature('test-experiment-feature')
    expect(CreateUserExperimentMutation).not.toHaveBeenCalled()
  })
})
