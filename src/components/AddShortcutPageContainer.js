import { createFragmentContainer, graphql } from 'react-relay'
import AddShortcutPage from 'src/components/AddShortcutPage'

export default createFragmentContainer(AddShortcutPage, {
  app: graphql`
    fragment AddShortcutPageContainer_app on App {
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
    fragment AddShortcutPageContainer_user on User {
      id
      searchEngine {
        engineId
        inputPrompt
        searchUrlPersonalized
      }
      widgets {
        edges {
          node {
            id
            data
            name
            type
            enabled
          }
        }
      }
      yahooPaidSearchRewardOptIn
    }
  `,
})
