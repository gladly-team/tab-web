import features from 'src/features/features.json'
import { trackingCallback } from 'src/utils/growthbook'

const { GrowthBook, GrowthBookProvider } = jest.requireActual(
  '@growthbook/growthbook-react'
)
const mockGrowthBook = jest.createMockFromModule('@growthbook/growthbook-react')

mockGrowthBook.useGrowthBook = jest.fn(() => {
  const growthbook = new GrowthBook({
    trackingCallback,
  })
  growthbook.setFeatures(features)
  return growthbook
})

mockGrowthBook.GrowthBook = jest.fn(
  () =>
    new GrowthBook({
      trackingCallback,
    })
)
mockGrowthBook.GrowthBookProvider = GrowthBookProvider

module.exports = mockGrowthBook
