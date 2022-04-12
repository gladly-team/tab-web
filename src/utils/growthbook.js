/* eslint-disable import/prefer-default-export */

import CreateUserExperimentMutation from './mutations/CreateUserExperimentMutation'
import logger from './logger'

// `experiment` has shape:
// {
//   "variations": [
//     false,
//     true
//   ],
//   "key": "test-experiment",
//   "coverage": 1
// }
//
// `result` has shape:
// {
//   hashAttribute: "id",
//   hashValue: "abc-123-some-user-id",
//   inExperiment: true,
//   value: true,
//   variationId: 1,
// }
export const trackingCallback = (experiment, result) => {
  let variationValueStr = ''
  try {
    variationValueStr = JSON.stringify(result.value)
  } catch (e) {
    logger.error(e)
  }
  return CreateUserExperimentMutation({
    userId: result.hashValue,
    experimentId: experiment.key,
    variationId: result.variationId,
    variationValueStr,
  })
}

export const validateAttributesObject = (userId, attributes) => {
  Object.keys(attributes).forEach((attribute) => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook Attribute ${attribute} for userId ${userId} was ${attributes[attribute]}`
      )
    }
  })
}
