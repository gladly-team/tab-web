import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddShortcut from './AddShortcut'

export default {
  title: 'Components/AddShortcut',
  component: AddShortcut,
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

const useStyles = makeStyles((theme) => ({
  widthDiv: {
    width: theme.spacing(50),
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.widthDiv}>
      <AddShortcut {...args} />
    </div>
  )
}

export const basic = Template.bind({})
basic.args = {}

export const existingValues = Template.bind({})
existingValues.args = {
  existingName: 'Google',
  existingUrl: 'http://www.google.com',
}
