import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SfacActivity from './SfacActivity'

export default {
  title: 'Components/SfacActivity',
  component: SfacActivity,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: 'grey',
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <SfacActivity {...args} />
    </div>
  )
}

export const active = Template.bind({})
active.args = {
  user: {
    cause: {
      name: 'Trees',
    },
    searches: 100,
    searchesToday: 5,
    sfacActivityState: 'active',
  },
}

export const inactive = Template.bind({})
inactive.args = {
  user: {
    cause: {
      name: 'Reproductive Health',
    },
    searches: 100,
    searchesToday: 5,
    sfacActivityState: 'inactive',
  },
}

export const newStatus = Template.bind({})
newStatus.args = {
  user: {
    cause: {
      name: 'Cats',
    },
    searches: 0,
    searchesToday: 0,
    sfacActivityState: 'new',
  },
}
