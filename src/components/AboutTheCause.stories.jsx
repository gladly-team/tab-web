import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import AboutTheCause from './AboutTheCause'

export default {
  title: 'Components/AboutTheCause',
  component: AboutTheCause,
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
      <AboutTheCause {...args} />
    </div>
  )
}

export const normal = Template.bind({})
normal.args = {
  cause: {
    about:
      'Everyone deserves access to quality health care, regardless of their income or where they live. With each tab you open, you are helping to provide health care access to those most in need and to strengthen public health systems all around the world.',
  },
}
