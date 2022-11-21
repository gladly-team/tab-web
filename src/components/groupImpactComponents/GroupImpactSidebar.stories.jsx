import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GroupImpactSidebar from './GroupImpactSidebar'

export default {
  title: 'Components/Group Impact/GroupImpactSidebar',
  component: GroupImpactSidebar,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    height: 400,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <GroupImpactSidebar {...args} />
    </div>
  )
}

export const completed = Template.bind({})
completed.args = {
  mode: 'completed',
  impactTitle: 'Fund two visits from a community healthworker',
}

export const started = Template.bind({})
started.args = {
  mode: 'started',
  impactTitle: 'Fund two visits from a community healthworker',
}
