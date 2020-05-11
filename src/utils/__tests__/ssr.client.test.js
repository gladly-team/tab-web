/**
 * @jest-environment jsdom
 */
import { isClientSide, isServerSide } from 'src/utils/ssr'

// Note the jest-environment docstring at the top of this file.
describe('ssr.js in a client environment', () => {
  it('returns true from isClientSide()', () => {
    expect.assertions(1)
    expect(isClientSide()).toBe(true)
  })

  it('returns false from isServerSide()', () => {
    expect.assertions(1)
    expect(isServerSide()).toBe(false)
  })
})
