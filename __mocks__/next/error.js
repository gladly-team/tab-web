import React from 'react'

const MockNextErrorPage = jest.fn(() => <div>404</div>)
MockNextErrorPage.displayName = 'Mock404'

export const getServerSideProps = jest.fn()

export default MockNextErrorPage
