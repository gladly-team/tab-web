/* globals window */

test('mockWindowLocation modifies the window.location object', () => {
  const mockWindowLocation =
    require('src/utils/testHelpers/mockWindowLocation').default
  expect(window.location.hostname).not.toEqual('foo.com')
  mockWindowLocation({
    hostname: 'foo.com',
  })
  expect(window.location.hostname).toEqual('foo.com')
})
