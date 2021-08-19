import React from 'react'

import MissionsComponent from 'src/pages/missions'
import StubContainer from 'react-storybooks-relay-container'

export default {
  title: 'Pages/Missions',
  component: MissionsComponent,
  parameters: {
    progress: {
      values: [
        { name: 'full', value: 100 },
        { name: 'half full', value: 50 },
        { name: 'empty', value: 0 },
      ],
    },
  },
}

// data: PropTypes.shape({
//     user: PropTypes.shape({
//       email: PropTypes.string,
//       id: PropTypes.string,
//       username: PropTypes.string,
//     }),
//   }),
// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => (
  <StubContainer Component={MissionsComponent} props={args} />
)
export const standard = Template.bind({})
standard.args = {
  data: { user: { email: 'test', id: 'someid' } },
}
