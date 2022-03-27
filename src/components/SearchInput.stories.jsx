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
  userId: 'abcdefghijklmno',
  tooltip: true,
  app: {
    searchEngines: {
      edges: [
        {
          node: {
            name: 'DuckDuckGo',
            engineId: 'DuckDuckGo',
            searchUrl: 'https://duckduckgo.com/?q={searchTerms}',
            rank: 3,
            isCharitable: false,
            inputPrompt: 'Search DuckDuckGo',
          },
        },
        {
          node: {
            name: 'Google',
            engineId: 'Google',
            searchUrl: 'https://www.google.com/search?q={searchTerms}',
            rank: 1,
            isCharitable: false,
            inputPrompt: 'Search Google',
          },
        },
        {
          node: {
            name: 'Ecosia',
            engineId: 'Ecosia',
            searchUrl: 'https://www.ecosia.org/search?q={searchTerms}',
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
      searchUrl: 'https://www.google.com/search?q={searchTerms}',
      inputPrompt: 'Search Google',
    },
  },
}
