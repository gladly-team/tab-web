import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'

jest.mock('src/utils/featureFlags')
jest.mock('src/utils/pageWrappers/return404If')

const getMockProps = () => ({})

beforeEach(() => {
  const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
  showDevelopmentOnlyDemoPages.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()

  // See below regarding:
  // https://github.com/facebook/jest/issues/8987
  // jest.resetModules()
})

// To test the higher-order components, we need to reset modules,
// but that's causing an error with hooks:
// https://github.com/facebook/jest/issues/8987

describe('demo index page', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const DemosIndexPage = require('src/containers/demos/index').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<DemosIndexPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes the title', () => {
    expect.assertions(1)
    const DemosIndexPage = require('src/containers/demos/index').default
    const mockProps = getMockProps()
    const wrapper = shallow(<DemosIndexPage {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.prop('variant') === 'h3')
        .first()
        .render()
        .text()
    ).toEqual('Demos')
  })
})
