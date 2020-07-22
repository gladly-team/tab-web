describe('ensureValuesAreDefined', () => {
  it('does not throw if passed a number', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined(132)
    }).not.toThrow()
  })

  it('does not throw if passed a string', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined('hi')
    }).not.toThrow()
  })

  it('does not throw if passed false', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined(false)
    }).not.toThrow()
  })

  it('does not throw if passed true', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined(true)
    }).not.toThrow()
  })

  it('does not throw if called with an array of one string', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined(['hey'])
    }).not.toThrow()
  })

  it('throws if called with no argument', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined()
    }).toThrow()
  })

  it('throws if called with null', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined(null)
    }).toThrow()
  })

  it('throws if called with an empty array', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined([])
    }).toThrow()
  })

  it('throws if called with an array of null', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined([null, null])
    }).toThrow()
  })

  it('throws if called with an array with one undefined item and other defined items', () => {
    const ensureValuesAreDefined = require('src/utils/ensureValuesAreDefined')
      .default
    expect(() => {
      ensureValuesAreDefined([12, undefined, 'hello'])
    }).toThrow()
  })
})
