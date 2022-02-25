import React from 'react'
import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Notification from './Notification'

export default {
  title: 'Components/Notification',
  component: Notification,
  parameters: {
    backgrounds: {
      default: 'grey',
      values: [
        { name: 'grey', value: '#F2F2F2' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
}

const Template = (args) => <Notification {...args} />
export const basic = Template.bind({})
basic.args = {
  text: (
    <div style={{ width: '300px' }}>
      <Typography gutterBottom>
        You did it! You just turned your tab into a treat for a cat. Keep it up,
        and do good with every new tab!
      </Typography>
    </div>
  ),

  buttonText: 'Hooray!',
  buttonOnClick: () => {
    // eslint-disable-next-line no-undef, no-alert
    window.alert('you clicked')
  },
  onClose: () => {},
  includeClose: false,
}

export const withCloseButton = Template.bind({})
withCloseButton.args = {
  text: (
    <div style={{ width: '300px' }}>
      <Typography variant="body2" style={{ fontWeight: 'bold' }} gutterBottom>
        Introducing Squads!
      </Typography>
      <Typography variant="body2" gutterBottom>
        Start a mission with your friends and work together to help get a
        shelter cat adopted! When you work together with your squad you can make
        a larger impact, sooner.
      </Typography>
    </div>
  ),
  buttonText: 'Create A Squad',
  buttonOnClick: () => {},
  onClose: () => {},
  includeClose: true,
}

export const withSecondaryButton = Template.bind({})
withSecondaryButton.args = {
  text: (
    <div style={{ width: '300px' }}>
      <Typography variant="body2" style={{ fontWeight: 'bold' }} gutterBottom>
        Introducing Squads!
      </Typography>
      <Typography variant="body2" gutterBottom>
        Start a mission with your friends and work together to help get a
        shelter cat adopted! When you work together with your squad you can make
        a larger impact, sooner.
      </Typography>
    </div>
  ),
  buttonText: 'Create A Squad',
  buttonOnClick: () => {},
  includeSecondaryButton: true,
  secondaryButtonText: 'No Thanks',
  secondaryButtonOnClick: () => {},
  onClose: () => {},
  includeClose: true,
}

export const withCustomButton = Template.bind({})
withCustomButton.args = {
  text: (
    <div style={{ width: '300px' }}>
      <Typography variant="body2" style={{ fontWeight: 'bold' }} gutterBottom>
        Introducing Squads!
      </Typography>
      <Typography variant="body2" gutterBottom>
        Start a mission with your friends and work together to help get a
        shelter cat adopted! When you work together with your squad you can make
        a larger impact, sooner.
      </Typography>
    </div>
  ),
  buttons: [<Button key={1}>Test-Button</Button>],
  onClose: () => {},
  includeClose: true,
}
