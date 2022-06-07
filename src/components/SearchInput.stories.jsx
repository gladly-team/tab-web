import React from 'react'
import SearchInput from './SearchInput'

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => (
  <div style={{ padding: '150px' }}>
    <SearchInput {...args} />
  </div>
)
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
  user: {
    searchEngine: {
      name: 'Google',
      engineId: 'Google',
      inputPrompt: 'Search Google',
    },
    yahooPaidSearchRewardOptIn: false,
  },
}
