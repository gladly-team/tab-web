import { isPlural } from 'src/utils/formatting'

describe('commaFormatted', () => {
  it('comma-formats a large stringified float as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted('460932.44')).toBe('460,932.44')
  })

  it('comma-formats a large stringified integer as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted('460932')).toBe('460,932')
  })

  it('comma-formats an even larger stringified integer as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted('123456789')).toBe('123,456,789')
  })

  it('comma-formats a small stringified integer as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted('21')).toBe('21')
  })

  it('comma-formats a large float as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted(460932.44)).toBe('460,932.44')
  })

  it('comma-formats zero as expected', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted(0)).toBe('0')
  })

  it('returns a stringified zero if it receives an undefined argument value', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted(undefined)).toBe('0')
  })

  it('returns a stringified zero if it receives a null argument value', () => {
    const { commaFormatted } = require('src/utils/formatting')
    expect(commaFormatted(null)).toBe('0')
  })
})

describe('currencyFormatUSD', () => {
  it('formats zero correctly', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD(0)).toBe('$0.00')
  })

  it('formats a small float correctly', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD(0.14623)).toBe('$0.15')
  })

  it('formats a larger float correctly', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD(1235.2)).toBe('$1,235.20')
  })

  it('formats a large integer correctly', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD(246813579)).toBe('$246,813,579.00')
  })

  it('parses a stringified integer', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD('246813579')).toBe('$246,813,579.00')
  })

  it('parses a stringified float', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(currencyFormatUSD('2123.429')).toBe('$2,123.43')
  })

  it('throws if passed a string value that cannot be parsed', () => {
    const { currencyFormatUSD } = require('src/utils/formatting')
    expect(() => {
      currencyFormatUSD('xyz')
    }).toThrow('Could not parse this value for currency formatting: xyz')
  })
})
describe('isPlural', () => {
  it('formats correctly if value is 0', () => {
    expect(isPlural(0)).toBe('s')
  })

  it('formats correctly if value is 1', () => {
    expect(isPlural(1)).toBe('')
  })

  it('formats correctly if value is greater than 1', () => {
    expect(isPlural(1234)).toBe('s')
  })

  it("doesn't throw if value is not a number", () => {
    expect(isPlural('thisshouldneverhappen')).toBe('s')
  })
})
