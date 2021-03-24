/* globals window */
import { isServerSide } from 'src/utils/ssr'
import { withBasePath } from 'src/utils/urls'

jest.mock('src/utils/ssr')
jest.mock('src/utils/urls')

// Strategy for testing against `window.location`:
// https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
const oldWindowLocation = window.location
beforeAll(() => {
  delete window.location
  window.location = Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(oldWindowLocation),
      assign: {
        configurable: true,
        value: jest.fn(),
      },
    }
  )
})

beforeEach(() => {
  isServerSide.mockReturnValue(false)

  // Default to not having any base path.
  withBasePath.mockImplementation((val) => val)

  Object.defineProperty(window, 'location', {
    configurable: true,
    value: undefined,
  })
})

afterAll(() => {
  window.location = oldWindowLocation
})

describe('navigation: setWindowLocation', () => {
  it('sets window.location', () => {
    const { setWindowLocation } = require('src/utils/navigation')
    setWindowLocation('/foo')
    expect(window.location).toEqual('/foo')
  })

  it('sets window.location, using the base path when one is set', () => {
    const { setWindowLocation } = require('src/utils/navigation')
    withBasePath.mockImplementation((val) => `/my-base-path${val}`)
    setWindowLocation('/foo')
    expect(window.location).toEqual('/my-base-path/foo')
  })

  it('sets window.location, *not* using the base path when the "addBasePath" option is false', () => {
    const { setWindowLocation } = require('src/utils/navigation')
    withBasePath.mockImplementation((val) => `/my-base-path${val}`)
    setWindowLocation('/foo', { addBasePath: false })
    expect(window.location).toEqual('/foo')
  })
})
