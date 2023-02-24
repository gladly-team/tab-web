import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import ImpactMetricList from './ImpactMetricList'

export default {
  title: 'Components/Group Impact/ImpactMetricList',
  component: ImpactMetricList,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 700,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <ImpactMetricList {...args} />
    </div>
  )
}

export const list = Template.bind({})
list.args = {
  charityName: 'Partners in Health',
  impactMetrics: [
    {
      id: 'nQUobFEFe',
      charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
      dollarAmount: 5e6, // $5
      impactTitle: 'Provide 1 home visit from a community health worker',
      metricTitle: '1 home visit',
      description:
        'Living in the communities in which they work, community health workers are trusted neighbors who know their community best and use their linguistic, cultural, and technical expertise.\n\nThis provides access to care for people who might not otherwise have it.',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
      active: false,
    },
    {
      id: 'mhwYA7KbK',
      charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705', // Partners in Health
      dollarAmount: 60e6, // $60
      impactTitle: 'Provide prenatal care for one woman',
      metricTitle: 'prenatal care',
      description:
        'Provide prenatal care to one impoverished mother-to-be--and ensure her pregnancy stays safe.',
      whyValuableDescription:
        'This prenatal care helps ensure a safe pregnancy for an impoverished mother-to-be.',
      active: false,
    },
  ],
}
