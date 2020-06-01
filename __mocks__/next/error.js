import React from 'react'

const MockNextErrorPage = jest.fn(() => <div>404</div>)
MockNextErrorPage.getInitialProps = jest.fn(() => Promise.resolve({}))
MockNextErrorPage.displayName = 'Mock404'

module.exports = MockNextErrorPage
