import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import SfacActivityButton from './SfacActivityButton'

export default {
  title: 'Components/SfacActivityButton',
  component: SfacActivityButton,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    padding: 24,
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <SfacActivityButton {...args} />
    </div>
  )
}

export const active = Template.bind({})
active.args = {
  active: true,
}

export const inactive = Template.bind({})
inactive.args = {
  active: false,
}
