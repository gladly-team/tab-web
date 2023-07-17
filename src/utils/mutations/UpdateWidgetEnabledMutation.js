import { graphql } from 'react-relay'
import callMutation from './callMutation'

const mutation = graphql`
  mutation UpdateWidgetEnabledMutation($input: UpdateWidgetEnabledInput!) {
    updateWidgetEnabled(input: $input) {
      widget {
        enabled
      }
    }
  }
`

const UpdateWidgetEnabledMutation = (user, widget, enabled) => {
  const userId = user.id
  const widgetId = widget.id

  return callMutation({
    mutation,
    variables: {
      input: { userId, widgetId, enabled },
    },
  })
}

export default UpdateWidgetEnabledMutation
