import { isNil } from 'lodash/lang'

let mockStorage = {}

// eslint-disable-next-line no-underscore-dangle
export const __mockClear = () => {
  mockStorage = {}
}

export default {
  getItem: jest.fn((key) => mockStorage[key]),
  setItem: jest.fn((key, val) => {
    if (!isNil(val)) {
      mockStorage[key] = String(val)
    }
  }),
  removeItem: jest.fn((key) => {
    delete mockStorage[key]
  }),
  clear: jest.fn(() => {
    __mockClear()
  }),
}
