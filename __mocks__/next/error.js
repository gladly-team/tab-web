import React from 'react'

const Mock404Page = jest.fn(() => <div>404</div>)
Mock404Page.getInitialProps = jest.fn(() => Promise.resolve({}))
Mock404Page.displayName = 'Mock404'

module.exports = Mock404Page
