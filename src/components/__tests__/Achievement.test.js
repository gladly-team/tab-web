import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  // TODO
  impactText: 'Plant 1 tree',
})

describe('Achievement component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const Achievement = require('src/components/Achievement').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Achievement {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the impactText as a large header', () => {
    expect.assertions(2)
    const Achievement = require('src/components/Achievement').default
    const mockProps = { ...getMockProps(), impactText: 'Do good stuff' }
    const wrapper = shallow(<Achievement {...mockProps} />)
    const impactTextElem = wrapper
      .find(Typography)
      .filterWhere((elem) => elem.render().text() === 'Do good stuff')
    expect(impactTextElem.exists()).toBe(true)
    expect(impactTextElem.prop('variant')).toEqual('h5')
  })
})
