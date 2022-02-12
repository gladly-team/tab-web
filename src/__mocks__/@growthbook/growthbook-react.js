import features from 'src/features/features.json'

const { GrowthBook, GrowthBookProvider } = jest.requireActual(
  '@growthbook/growthbook-react'
)
const mockGrowthBook = jest.createMockFromModule('@growthbook/growthbook-react')

mockGrowthBook.useGrowthBook = jest.fn(() => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  return growthbook
})

mockGrowthBook.GrowthBook = jest.fn(() => new GrowthBook())
mockGrowthBook.GrowthBookProvider = GrowthBookProvider

module.exports = mockGrowthBook
