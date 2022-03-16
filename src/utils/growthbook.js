/* eslint-disable import/prefer-default-export */

import CreateUserExperimentMutation from './mutations/CreateUserExperimentMutation'
import logger from './logger'

export const trackingCallback = (experiment, result) =>
  CreateUserExperimentMutation(result.hashValue, experiment.key, result.value)

export const validateAttributesObject = (userId, attributes) => {
  Object.keys(attributes).forEach((attribute) => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook Attribute ${attribute} for userId ${userId} was ${attributes[attribute]}`
      )
    }
  })
}
