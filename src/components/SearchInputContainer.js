import { createFragmentContainer, graphql } from 'react-relay'
import SearchInput from 'src/components/SearchInput'

export default createFragmentContainer(SearchInput, {
  app: graphql`
    fragment SearchInputContainer_app on App {
      searchEngines {
        edges {
          node {
            engineId
            name
            rank
            isCharitable
            inputPrompt
          }
        }
      }
    }
  `,
  user: graphql`
    fragment SearchInputContainer_user on User {
      searchEngine {
        engineId
        inputPrompt
        searchUrlPersonalized
      }
      yahooPaidSearchRewardOptIn
    }
  `,
})
