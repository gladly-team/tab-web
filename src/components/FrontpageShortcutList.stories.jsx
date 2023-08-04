import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
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
  user: {
    widgets: {
      edges: [
        {
          node: {
            id: 'abcde',
            data: JSON.stringify({
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
                {
                  id: 'cdef',
                  name: 'google2',
                  link: 'https://www.google2.com',
                },
                {
                  id: 'defg',
                  name: 'espn2',
                  link: 'https://www.espn2.com',
                },
                {
                  id: 'efgh',
                  name: 'google3',
                  link: 'https://www.google.com',
                },
                {
                  id: 'fghi',
                  name: 'espn3',
                  link: 'https://www.espn.com',
                },
                {
                  id: 'ghij',
                  name: 'google4',
                  link: 'https://www.google2.com',
                },
              ],
            }),
            type: WIDGET_TYPE_BOOKMARKS,
          },
        },
      ],
    },
  },
  openHandler: () => {},
}
