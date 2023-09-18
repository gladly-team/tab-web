import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import BackgroundColorPicker from './BackgroundColorPicker'

export default {
  title: 'Components/BackgroundColorPicker',
  component: BackgroundColorPicker,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 700,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <BackgroundColorPicker {...args} />
    </div>
  )
}

export const normal = Template.bind({})
normal.args = {
  user: {
    backgroundColor: '#138',
  },
  onBackgroundColorSelection: () => {
    // eslint-disable-next-line no-console
    console.log('onBackgroundColorSelection')
  },
}
