import React from 'react'
import { shallow } from 'enzyme'
import SvgIcon from '@material-ui/core/SvgIcon'
import PetsIcon from '@material-ui/icons/Pets'
import FavoriteIcon from '@material-ui/icons/Favorite'
import {
  mdiJellyfish,
  mdiHandshake,
  mdiPineTree,
  mdiMedicalBag,
  mdiFoodApple,
  mdiWater,
  mdiAccountHeart,
} from '@mdi/js'

const getMockProps = () => ({
  icon: 'paw',
})

describe('CauseIcon component', () => {
  it('renders without error', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<CauseIcon {...mockProps} />)
    }).not.toThrow()
  })

  it('returns the paw icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'paw',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    expect(wrapper.find(PetsIcon).exists()).toEqual(true)
  })

  it('returns the heart icon when an unsupported icon name is passed', () => {
    // Suppress expected error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'blah',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    expect(wrapper.find(FavoriteIcon).exists()).toEqual(true)
  })

  it('returns the jellyfish icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'jellyfish',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiJellyfish)
  })

  it('returns the handshake icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'handshake',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiHandshake)
  })

  it('returns the pine tree icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'pine-tree',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiPineTree)
  })

  it('returns the medical bag icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'medical-bag',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiMedicalBag)
  })

  it('returns the apple icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'food-apple',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiFoodApple)
  })

  it('returns the water icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'water',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiWater)
  })

  it('returns the person-heart icon', () => {
    const CauseIcon = require('src/components/CauseIcon').default
    const defaultMockProps = {
      ...getMockProps(),
      icon: 'person-heart',
    }
    const wrapper = shallow(<CauseIcon {...defaultMockProps} />)
    const svgIcon = wrapper.find(SvgIcon)
    const pathD = svgIcon.find('path').prop('d')
    expect(pathD).toEqual(mdiAccountHeart)
  })
})
