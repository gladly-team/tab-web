/* global window */

import { LAST_SEEN_GROUP_IMPACT_METRIC } from '../constants'

const sampleGroupImpactMetric = {
  id: '123456789',
  causeId: 'abcd',
  impactMetricId: '12345',
  dollarProgress: 1000,
  dollarGoal: 10000,
  dateStarted: '2020-01-10T10:00:00.000Z',
}

describe('local storage group impact manager', () => {
  it('setLastSeenGroupImpactMetric calls localStorage.setItem', () => {
    const localstorageGroupImpactManager =
      require('src/utils/localstorageGroupImpactManager').default
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      sampleGroupImpactMetric
    )
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      LAST_SEEN_GROUP_IMPACT_METRIC,
      JSON.stringify(sampleGroupImpactMetric)
    )
  })

  it('getLastSeenGroupImpactMetric defaults to null if malformed', () => {
    const localstorageGroupImpactManager =
      require('src/utils/localstorageGroupImpactManager').default
    window.localStorage.getItem.mockReturnValue('randomstring')
    expect(
      localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
    ).toEqual(null)
  })

  it('getLastSeenGroupImpactMetric defaults to null if features string is null', () => {
    const localstorageGroupImpactManager =
      require('src/utils/localstorageGroupImpactManager').default
    window.localStorage.getItem.mockReturnValue(null)
    expect(
      localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
    ).toEqual(null)
  })

  it('getLastSeenGroupImpactMetric fetches group impact metric', () => {
    const localstorageGroupImpactManager =
      require('src/utils/localstorageGroupImpactManager').default
    window.localStorage.getItem.mockReturnValue(
      JSON.stringify(sampleGroupImpactMetric)
    )
    expect(
      localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
    ).toEqual(sampleGroupImpactMetric)
  })
})
