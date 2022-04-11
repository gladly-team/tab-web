/* globals document */

import React from 'react'

import SearchSelect from './SearchSelect'

export default {
  title: 'Components/SearchSelect',
  component: SearchSelect,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <SearchSelect {...args} />
export const withoutCharitableEngine = Template.bind({})
withoutCharitableEngine.args = {
  anchorEl: document.createElement('button'),
  onClose: () => {},
  userId: 'abcdefghijklmno',
  userSearchEngine: {
    name: 'Google',
    engineId: 'Google',
    searchUrl: 'https://www.google.com/search?q={searchTerms}',
    inputPrompt: 'Search Google',
  },
  onMoreInfoClick: () => {},
  open: true,
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
  yahooPaidSearchRewardOptIn: false,
}

export const withCharitableEngine = Template.bind({})
withCharitableEngine.args = {
  anchorEl: document.createElement('button'),
  onClose: () => {},
  userId: 'abcdefghijklmno',
  userSearchEngine: {
    name: 'Google',
    engineId: 'Google',
    searchUrl: 'https://www.google.com/search?q={searchTerms}',
    inputPrompt: 'Search Google',
  },
  onMoreInfoClick: () => {},
  open: true,
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
      {
        node: {
          name: 'Search for a Cause',
          engineId: 'SearchForACause',
          searchUrl: 'http://tab.gladly.io/search/v2?q={searchTerms}',
          rank: 0,
          isCharitable: true,
          inputPrompt: 'Search for a Cause',
        },
      },
    ],
  },
  yahooPaidSearchRewardOptIn: false,
}

export const withCharitableEngineAndOptedIn = Template.bind({})
withCharitableEngineAndOptedIn.args = {
  anchorEl: document.createElement('button'),
  onClose: () => {},
  userId: 'abcdefghijklmno',
  userSearchEngine: {
    name: 'Google',
    engineId: 'Google',
    searchUrl: 'https://www.google.com/search?q={searchTerms}',
    inputPrompt: 'Search Google',
  },
  onMoreInfoClick: () => {},
  open: true,
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
      {
        node: {
          name: 'Search for a Cause',
          engineId: 'SearchForACause',
          searchUrl: 'http://tab.gladly.io/search/v2?q={searchTerms}',
          rank: 0,
          isCharitable: true,
          inputPrompt: 'Search for a Cause',
        },
      },
    ],
  },
  yahooPaidSearchRewardOptIn: true,
}
