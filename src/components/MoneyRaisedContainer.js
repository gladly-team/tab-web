import { createFragmentContainer, graphql } from 'react-relay'
import MoneyRaised from 'src/components/MoneyRaised'

export default createFragmentContainer(MoneyRaised, {
  app: graphql`
    fragment MoneyRaisedContainer_app on App {
      moneyRaised
      dollarsPerDayRate
    }
  `,
  user: graphql`
    fragment MoneyRaisedContainer_user on User {
      features {
        featureName
        variation
      }
    }
  `,
})
