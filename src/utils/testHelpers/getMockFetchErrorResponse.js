const getMockFetchErrorResponse = () => ({
  body: {},
  bodyUsed: true,
  headers: {},
  json: () => Promise.resolve({}),
  ok: false,
  redirected: false,
  status: 500,
  statusText: '',
  type: 'cors',
  url: 'https://example.com/foo/',
})

export default getMockFetchErrorResponse
