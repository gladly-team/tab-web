import { useGrowthBook } from '@growthbook/growthbook-react'

jest.mock('@growthbook/growthbook-react')

describe('growthbook features', () => {
  it('yahoo-search defaults to false because of defaultValue', () => {
    const growthbook = useGrowthBook()
    const feature = growthbook.feature('yahoo-search')

    expect(feature.value).toEqual(false)
    expect(feature.source).toEqual('defaultValue')
  })
})
