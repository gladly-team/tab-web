import { GrowthBook } from '@growthbook/growthbook-react'
import CreateUserExperimentMutation from 'src/utils/mutations/CreateUserExperimentMutation'
import { validateAttributesObject } from '../growthbook'

jest.mock('@growthbook/growthbook-react')
jest.mock('src/utils/mutations/CreateUserExperimentMutation')
jest.mock('src/utils/logger')

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
    expect(CreateUserExperimentMutation).toHaveBeenCalledWith({
      userId: 'test-user-id',
      experimentId: 'test-experiment-feature',
      variationId: 0,
      variationValueStr: '"variation-A"',
    })
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

  it('correctly validates attributes object', () => {
    const logger = require('src/utils/logger').default
    const mockObject = {
      id: 'abcdefghijklmno',
      env: null,
      causeId: 'causeId',
      v4BetaEnabled: true,
      joined: undefined,
      isTabTeamMember: null,
    }

    validateAttributesObject('abc', mockObject)

    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute env for userId abc was null'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute joined for userId abc was undefined'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute isTabTeamMember for userId abc was null'
    )
  })
})
