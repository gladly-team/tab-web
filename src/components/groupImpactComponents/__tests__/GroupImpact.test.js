import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  groupImpactMetric: {
    dollarProgress: 250,
    dollarGoal: 600,
    impactMetric: {
      impactTitle: 'impact-title',
      whyValuableDescription: 'why-valuable-description',
    },
  },
})

describe('GroupImpact component', () => {
  it('renders without error', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpact {...mockProps} />)
    }).not.toThrow()
  })
})
