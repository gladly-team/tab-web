import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
    yahooPaidSearchRewardOptIn: false,
  },
  closeHandler: () => {},
}
