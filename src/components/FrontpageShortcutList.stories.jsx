import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import FrontpageShortcutList from './FrontpageShortcutList'

export default {
  title: 'Components/FrontpageShortcutList',
  component: FrontpageShortcutList,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 700,
    width: 700,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <FrontpageShortcutList {...args} />
    </div>
  )
}
export const standard = Template.bind({})
standard.args = {
  bookmarks: [
    {
      id: 'abcd',
      name: 'google',
      link: 'https://www.google.com',
    },
    {
      id: 'bcde',
      name: 'espn',
      link: 'https://www.espn.com',
    },
  ],
  addShortcutClick: () => {},
}
