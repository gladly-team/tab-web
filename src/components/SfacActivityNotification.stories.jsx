import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SfacActivityNotification from './SfacActivityNotification'

export default {
  title: 'Components/SfacActivityNotification',
  component: SfacActivityNotification,
}

const useStyles = makeStyles((theme) => ({
  widthDiv: {
    width: theme.spacing(50),
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return <SfacActivityNotification {...args} className={classes.widthDiv} />
}
export const active = Template.bind({})
active.args = {
  activityState: 'active',
  totalSearches: 100,
  searchesToday: 5,
  impactName: 'Trees',
}

export const inactive = Template.bind({})
inactive.args = {
  activityState: 'inactive',
  totalSearches: 100,
  searchesToday: 5,
  impactName: 'Reproductive Health',
}

export const newStatus = Template.bind({})
newStatus.args = {
  activityState: 'new',
  totalSearches: 100,
  searchesToday: 5,
  impactName: 'Cats',
}
