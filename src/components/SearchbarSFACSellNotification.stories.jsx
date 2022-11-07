import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SearchbarSFACSellNotification from './SearchbarSFACSellNotification'

export default {
  title: 'Components/SearchbarSFACSellNotification',
  component: SearchbarSFACSellNotification,
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
    <SearchbarSFACSellNotification {...args} className={classes.widthDiv} />
  )
}

export const basic = Template.bind({})
basic.args = {
  userId: 'userId',
}
