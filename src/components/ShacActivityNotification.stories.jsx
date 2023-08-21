import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ShacActivityNotification from './ShacActivityNotification'

export default {
  title: 'Components/ShacActivityNotification',
  component: ShacActivityNotification,
}

const useStyles = makeStyles((theme) => ({
  widthDiv: {
    width: theme.spacing(50),
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return <ShacActivityNotification {...args} className={classes.widthDiv} />
}
export const active = Template.bind({})
active.args = {
  activityState: 'active',
  totalEarned: 350.5,
  impactName: 'Trees',
}

export const inactive = Template.bind({})
inactive.args = {
  activityState: 'inactive',
  totalEarned: 150.25,
  impactName: 'Reproductive Health',
}

export const newStatus = Template.bind({})
newStatus.args = {
  activityState: 'new',
  totalEarned: 13.25,
  impactName: 'Cats',
}
