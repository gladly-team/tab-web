/* global window */

import { STORAGE_FEATURES } from '../constants'

const sampleFeatures = [
  {
    featureName: 'dummy-test-1',
    variation: 'Control',
  },
  {
    featureName: 'dummy-test-2',
    variation: 'Experiment',
  },
]

describe('local storage features manager', () => {
  it('setFeatures calls localStorage.setItem', () => {
    const localStorageFeaturesManager =
      require('src/utils/localStorageFeaturesManager').default
    localStorageFeaturesManager.setFeatures(sampleFeatures)
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_FEATURES,
      JSON.stringify(sampleFeatures)
    )
  })

  it('getFeatures defaults to empty features list if malformed', () => {
    const localStorageFeaturesManager =
      require('src/utils/localStorageFeaturesManager').default
    window.localStorage.getItem.mockReturnValue('randomstring')
    expect(localStorageFeaturesManager.getFeatures()).toEqual([])
  })

  it('getFeatures fetches features', () => {
    const localStorageFeaturesManager =
      require('src/utils/localStorageFeaturesManager').default
    window.localStorage.getItem.mockReturnValue(JSON.stringify(sampleFeatures))
    expect(localStorageFeaturesManager.getFeatures()).toEqual(sampleFeatures)
  })

  it('getFeatureValue returns feature if exists', () => {
    const localStorageFeaturesManager =
      require('src/utils/localStorageFeaturesManager').default
    window.localStorage.getItem.mockReturnValue(JSON.stringify(sampleFeatures))
    expect(localStorageFeaturesManager.getFeatureValue('dummy-test-1')).toEqual(
      'Control'
    )
  })
})
