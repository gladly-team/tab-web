import React from 'react'
import { shallow } from 'enzyme'
import SvgIcon from '@material-ui/core/SvgIcon'
import PetsIcon from '@material-ui/icons/Pets'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
} from '../../utils/constants'

const getMockProps = (cause = STORAGE_CATS_CAUSE_ID) => ({
  cause,
})

describe('CauseIcon component', () => {
  it('renders without error', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<CauseIcon {...mockProps} />)
    }).not.toThrow()
  })

  it('shows the jellyfish icon when seas cause is passed into cause prop', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(STORAGE_SEAS_CAUSE_ID),
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    expect(wrapper.find(SvgIcon).exists()).toEqual(true)
    expect(wrapper.find(PetsIcon).exists()).toEqual(false)
  })

  it('shows the paws icon when a false cause is passed into cause prop', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = { ...getMockProps('asdfasdf') }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    expect(wrapper.find(PetsIcon).exists()).toEqual(true)
    expect(wrapper.find(SvgIcon).exists()).toEqual(false)
  })

  it('shows the paws icon when cats cause is passed into cause prop', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = { ...getMockProps() }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    expect(wrapper.find(PetsIcon).exists()).toEqual(true)
    expect(wrapper.find(SvgIcon).exists()).toEqual(false)
  })
})
