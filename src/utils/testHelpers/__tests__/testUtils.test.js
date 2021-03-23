/* globals window */

test('setWindowLocation modifies the window.location object', () => {
  const { setWindowLocation } = require('src/utils/testHelpers/testUtils')
  expect(window.location.hostname).not.toEqual('foo.com')
  setWindowLocation({
    hostname: 'foo.com',
  })
  expect(window.location.hostname).toEqual('foo.com')
})
