import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Markdown from 'src/components/Markdown'

const getMockProps = () => ({
  impactMetrics: [
    {
      id: 'nQUobFEFe',
      charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
      dollarAmount: 5e6, // $5
      impactTitle:
        'Provide {{count}} home visit from a community health worker',
      metricTitle: '1 home visit',
      description:
        'Living in the communities in which they work, community health workers are trusted neighbors who know their community best and use their linguistic, cultural, and technical expertise.\n\nThis provides access to care for people who might not otherwise have it.',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
      active: false,
      charityName: 'Partners in Health',
      impactCountPerMetric: 2,
    },
    {
      id: 'mhwYA7KbK',
      charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
      dollarAmount: 60e6, // $60
      impactTitle:
        'Provide {{count}} home visit from a community health worker',
      metricTitle: 'prenatal care',
      description:
        'Provide prenatal care to one impoverished mother-to-be--and ensure her pregnancy stays safe.',
      whyValuableDescription:
        'This prenatal care helps ensure a safe pregnancy for an impoverished mother-to-be.',
      active: false,
      charityName: 'Partners in Health',
      impactCountPerMetric: 2,
    },
  ],
})

describe('ImpactMetricList component', () => {
  it('renders without error', () => {
    const ImpactMetricList =
      require('src/components/groupImpactComponents/ImpactMetricList').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ImpactMetricList {...mockProps} />)
    }).not.toThrow()
  })

  it('displays each impact metrics information', () => {
    const ImpactMetricList =
      require('src/components/groupImpactComponents/ImpactMetricList').default
    const mockProps = getMockProps()
    const wrapper = mount(<ImpactMetricList {...mockProps} />)
    const impactMetricRows = wrapper.find('tr')

    for (let i = 0; i < mockProps.impactMetrics.length; i += 1) {
      const impactMetric = mockProps.impactMetrics[i]
      const cells = impactMetricRows.at(i + 1)
      expect(cells.find(Typography).first().text()).toEqual(
        'Provide 2 home visit from a community health worker'
      )

      expect(cells.find(Markdown).prop('children')).toEqual(
        impactMetric.description
      )
      expect(cells.find('span').at(0).text()).toEqual(impactMetric.metricTitle)
      expect(cells.find('span').at(1).text()).toEqual(impactMetric.charityName)
    }
  })
})
