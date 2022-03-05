/* eslint-disable import/prefer-default-export */

import CreateUserExperimentMutation from './mutations/CreateUserExperimentMutation'

export const trackingCallback = (experiment, result) =>
  CreateUserExperimentMutation(result.hashValue, experiment.key, result.value)
