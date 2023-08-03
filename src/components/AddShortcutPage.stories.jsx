import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
import AddShortcutPage from './AddShortcutPage'

export default {
  title: 'Components/AddShortcutPage',
  component: AddShortcutPage,
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
    width: theme.spacing(200),
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.widthDiv}>
      <AddShortcutPage {...args} />
    </div>
  )
}

export const standard = Template.bind({})
standard.args = {
  tooltip: 'Great! You can always switch your search engine here later on.',
  app: {
    searchEngines: {
      edges: [
        {
          node: {
            name: 'DuckDuckGo',
            engineId: 'DuckDuckGo',
            rank: 3,
            isCharitable: false,
            inputPrompt: 'Search DuckDuckGo',
          },
        },
        {
          node: {
            name: 'Google',
            engineId: 'Google',
            rank: 1,
            isCharitable: false,
            inputPrompt: 'Search Google',
          },
        },
        {
          node: {
            name: 'Ecosia',
            engineId: 'Ecosia',
            rank: 2,
            isCharitable: false,
            inputPrompt: 'Search Ecosia',
          },
        },
      ],
    },
  },
  userId: 'abcd',
  user: {
    searchEngine: {
      name: 'Google',
      engineId: 'Google',
      inputPrompt: 'Search Google',
    },
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
                {
                  id: 'hijk',
                  name: 'espn4',
                  link: 'https://www.espn2.com',
                },
                {
                  id: 'lmno',
                  name: 'espn5',
                  link: 'https://www.espn2.com',
                },
                {
                  id: 'pqrs',
                  name: 'espn5',
                  link: 'https://www.espn2.com',
                },
                {
                  id: 'qrst',
                  name: 'espn6',
                  link: 'https://www.espn2.com',
                },
              ],
            }),
            type: WIDGET_TYPE_BOOKMARKS,
          },
        },
      ],
    },
    yahooPaidSearchRewardOptIn: false,
  },
  closeHandler: () => {},
}

export const noIcons = Template.bind({})
noIcons.args = {
  tooltip: 'Great! You can always switch your search engine here later on.',
  app: {
    searchEngines: {
      edges: [
        {
          node: {
            name: 'DuckDuckGo',
            engineId: 'DuckDuckGo',
            rank: 3,
            isCharitable: false,
            inputPrompt: 'Search DuckDuckGo',
          },
        },
        {
          node: {
            name: 'Google',
            engineId: 'Google',
            rank: 1,
            isCharitable: false,
            inputPrompt: 'Search Google',
          },
        },
        {
          node: {
            name: 'Ecosia',
            engineId: 'Ecosia',
            rank: 2,
            isCharitable: false,
            inputPrompt: 'Search Ecosia',
          },
        },
      ],
    },
  },
  userId: 'abcd',
  user: {
    searchEngine: {
      name: 'Google',
      engineId: 'Google',
      inputPrompt: 'Search Google',
    },
    widgets: {
      edges: [],
    },
    yahooPaidSearchRewardOptIn: false,
  },
  closeHandler: () => {},
}
