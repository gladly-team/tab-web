import React from 'react'
import MissionSocialShare from './MissionSocialShare'

export default {
  title: 'Views/Missions/MissionSocialShare',
  component: MissionSocialShare,
}

const Template = (args) => (
  <div style={{ maxWidth: '468px', margin: '20px' }}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <MissionSocialShare {...args} />
  </div>
)
export const standard = Template.bind({})
standard.args = {
  user: {
    username: 'testUsername1',
    id: '123456789',
  },
  missionId: '123456789',
  // eslint-disable-next-line no-console
  emailSentCallback: (data) => console.log(data),
}
