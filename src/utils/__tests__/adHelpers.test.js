import React from 'react'
import { shallow } from 'enzyme'

jest.mock('tab-ads')

beforeEach(() => {
  process.env.NEXT_PUBLIC_ADS_ENABLED = true
  process.env.NEXT_PUBLIC_ADS_USE_MOCK_ADS = false
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('isGAMDevEnvironment', () => {
  it('returns false when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT is undefined', async () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(false)
  })

  it('returns false when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT=false', async () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT = false
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(false)
  })

  it('returns true when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT=true', async () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT = true
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(true)
  })
})
