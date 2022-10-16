import React from 'react'

import { MONEY_RAISED_EXCLAMATION_POINT } from 'src/utils/experiments'
import MoneyRaised from './MoneyRaised'

export default {
  title: 'Components/MoneyRaised',
  component: MoneyRaised,
  parameters: {
    backgrounds: {
      default: 'black',
      values: [
        { name: 'grey', value: '#F2F2F2' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
}

const Template = (args) => <MoneyRaised {...args} />
export const normal = Template.bind({})
normal.args = {
  user: {
    features: [
      {
        featureName: MONEY_RAISED_EXCLAMATION_POINT,
        variation: 'false',
      },
    ],
  },
  app: {
    moneyRaised: 1487105,
    dollarsPerDayRate: 563,
  },
}

export const exclamation = Template.bind({})
exclamation.args = {
  user: {
    features: [
      {
        featureName: MONEY_RAISED_EXCLAMATION_POINT,
        variation: 'true',
      },
    ],
  },
  app: {
    moneyRaised: 1487105,
    dollarsPerDayRate: 563,
  },
}
