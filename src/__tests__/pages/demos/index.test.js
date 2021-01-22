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
})

describe('demo index page', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const DemosIndexPage = require('src/pages/demos/index').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<DemosIndexPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes the title', () => {
    expect.assertions(1)
    const DemosIndexPage = require('src/pages/demos/index').default
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
