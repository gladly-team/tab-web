import React from 'react'
import { shallow } from 'enzyme'
import { accountURL } from 'src/utils/urls'

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('settings/index.js', () => {
  it('renders nothing', async () => {
    expect.assertions(1)
    const SettingsIndexPage = require('src/pages/settings/index').default
    const wrapper = shallow(<SettingsIndexPage />)
    expect(wrapper.html()).toBeNull()
  })
})

describe('settings/index.js: getServerSideProps', () => {
  it('calls `withAuthUserTokenSSR` shows a loader when unauthed', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/settings/index')
    const result = await getServerSideProps()
    expect(result).toEqual({
      redirect: { destination: accountURL, permanent: false },
    })
  })
})
