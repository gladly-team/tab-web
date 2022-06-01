import { getFeatureValue } from '../growthbookUtils'

describe('getFeature', () => {
  it('correctly gets the feature amongst a list', () => {
    const features = [
      {
        featureName: 'test-feature-1',
        variation: true,
      },
      {
        featureName: 'test-feature-2',
        variation: 'test',
      },
    ]
    expect(getFeatureValue(features, 'test-feature-1')).toEqual(true)
    expect(getFeatureValue(features, 'test-feature-2')).toEqual('test')
  })

  it('returns undefined if feature not in list', () => {
    const features = [
      {
        featureName: 'test-feature-1',
        variation: true,
      },
      {
        featureName: 'test-feature-2',
        variation: 'test',
      },
    ]
    expect(getFeatureValue(features, 'non-existent-feature')).toBeUndefined()
  })
})
