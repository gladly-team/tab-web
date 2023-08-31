import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import ShacActivity from './ShacActivity'

export default {
  title: 'Components/ShacActivity',
  component: ShacActivity,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    padding: 24,
    paddingLeft: 96,
    width: '100%',
    minHeight: 400,
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <ShacActivity {...args} />
    </div>
  )
}

export const active = Template.bind({})
active.args = {
  user: {
    cause: {
      name: 'Trees',
    },
    shacTotalEarned: 200.3,
    shacActivityState: 'active',
  },
}

export const inactive = Template.bind({})
inactive.args = {
  user: {
    cause: {
      name: 'Reproductive Health',
    },
    shacTotalEarned: 150.25,
    shacActivityState: 'inactive',
  },
}

export const newStatus = Template.bind({})
newStatus.args = {
  user: {
    cause: {
      name: 'Cats',
    },
    totalEarned: 0,
    shacActivityState: 'new',
  },
}
