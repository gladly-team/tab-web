import { createFragmentContainer, graphql } from 'react-relay'
import FrontpageShortcutList from 'src/components/FrontpageShortcutList'

export default createFragmentContainer(FrontpageShortcutList, {
  user: graphql`
    fragment FrontpageShortcutListContainer_user on User {
      id
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
    }
  `,
})
