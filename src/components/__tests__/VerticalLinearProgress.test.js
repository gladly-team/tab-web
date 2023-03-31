/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Stars } from '@mui/icons-material'

const getMockProps = () => ({
  progress: [25, 50],
  width: 64,
  borderRadius: 32,
  showMarkers: false,
  colors: ['brown', 'red'],
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('VerticalLinearProgress component', () => {
  it('renders without error', () => {
    const VerticalLinearProgress =
      require('src/components/VerticalLinearProgress').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<VerticalLinearProgress {...mockProps} />)
    }).not.toThrow()
  })

  it('passes on progress to LinearProgress element', () => {
    const VerticalLinearProgress =
      require('src/components/VerticalLinearProgress').default
    const mockProps = getMockProps()
    const wrapper = shallow(<VerticalLinearProgress {...mockProps} />)
    const linearProgress = wrapper.find(LinearProgress)
    expect(linearProgress.at(0).prop('value')).toEqual(mockProps.progress[0])
    expect(linearProgress.at(1).prop('value')).toEqual(mockProps.progress[1])
  })

  it('does not show markers if that showMarkers is false', () => {
    const VerticalLinearProgress =
      require('src/components/VerticalLinearProgress').default
    const mockProps = getMockProps()
    const wrapper = shallow(<VerticalLinearProgress {...mockProps} />)
    expect(wrapper.find(Stars)).toEqual({})
  })

  it('does show markers if showMarkers is true', () => {
    const VerticalLinearProgress =
      require('src/components/VerticalLinearProgress').default
    const mockProps = {
      ...getMockProps(),
      showMarkers: true,
    }
    const wrapper = shallow(<VerticalLinearProgress {...mockProps} />)
    expect(wrapper.find(Stars)).toHaveLength(1)
  })

  it('sets start and end progress correctly before/after render even with starting progress', () => {
    const VerticalLinearProgress =
      require('src/components/VerticalLinearProgress').default
    const mockProps = {
      ...getMockProps(),
      startingProgress: [20, 40],
    }
    const wrapper = shallow(<VerticalLinearProgress {...mockProps} />)
    const linearProgress = wrapper.find(LinearProgress)
    expect(linearProgress.at(0).prop('value')).toEqual(
      mockProps.startingProgress[0]
    )
    expect(linearProgress.at(1).prop('value')).toEqual(
      mockProps.startingProgress[1]
    )

    const wrapperMounted = mount(<VerticalLinearProgress {...mockProps} />)
    const linearProgressMounted = wrapperMounted.find(LinearProgress)
    expect(linearProgressMounted.at(0).prop('value')).toEqual(
      mockProps.progress[0]
    )
    expect(linearProgressMounted.at(1).prop('value')).toEqual(
      mockProps.progress[1]
    )
  })
})
