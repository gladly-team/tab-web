import { graphql } from 'react-relay'
import callMutation from './callMutation'

const mutation = graphql`
  mutation UpdateWidgetDataMutation($input: UpdateWidgetDataInput!) {
    updateWidgetData(input: $input) {
      widget {
        data
      }
    }
  }
`

const UpdateWidgetDataMutation = (user, widget, data) => {
  const userId = user.id
  const widgetId = widget.id

  return callMutation({
    mutation,
    variables: {
      input: { userId, widgetId, data },
    },
  })
}

export default UpdateWidgetDataMutation
