jest.mock('../logger')

beforeEach(() => {
  process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = '0.01287'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('globals', () => {
  it('returns the estimated money raised per tab [test #1]', () => {
    process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = '0.01287'
    const { getEstimatedMoneyRaisedPerTab } = require('../misc')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.01287)
  })

  it('returns the estimated money raised per tab [test #2]', () => {
    process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = '2'
    const { getEstimatedMoneyRaisedPerTab } = require('../misc')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(2.0)
  })

  it('returns 0 for the estimated money raised per tab if process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB is undefined', () => {
    process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = undefined
    const { getEstimatedMoneyRaisedPerTab } = require('../misc')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.0)
  })

  it('returns 0 for the estimated money raised per tab if process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB does not parse into a float', () => {
    process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = 'xyz'
    const { getEstimatedMoneyRaisedPerTab } = require('../misc')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.0)
  })
})
