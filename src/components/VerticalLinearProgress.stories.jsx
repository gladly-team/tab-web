import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import VerticalLinearProgress from './VerticalLinearProgress'

export default {
  title: 'Components/VerticalLinearProgress',
  component: VerticalLinearProgress,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    height: 400,
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <VerticalLinearProgress {...args} />
    </div>
  )
}

export const inGroupImpactSidebar = Template.bind({})
inGroupImpactSidebar.args = {
  progress: 25,
  width: 64,
  borderRadius: 32,
  showMarkers: true,
}
inGroupImpactSidebar.parameters = {}

export const inCollapsedSidebar = Template.bind({})
inCollapsedSidebar.args = {
  progress: 30,
  width: 8,
  borderRadius: 0,
  showMarkers: false,
}
inCollapsedSidebar.parameters = {}

export const animated = Template.bind({})
animated.args = {
  progress: 80,
  width: 8,
  borderRadius: 0,
  showMarkers: false,
  startingProgress: 30,
}
animated.parameters = {}

export const animatedDownwards = Template.bind({})
animatedDownwards.args = {
  progress: 30,
  width: 8,
  borderRadius: 0,
  showMarkers: false,
  startingProgress: 80,
}
animatedDownwards.parameters = {}
