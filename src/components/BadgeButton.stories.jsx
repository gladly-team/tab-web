import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import SearchIcon from '@material-ui/icons/Search'
import { ShoppingCart } from '@material-ui/icons'
import BadgeButton from './BadgeButton'

export default {
  title: 'Components/BadgeButton',
  component: BadgeButton,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    padding: 24,
  },
}))

const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <BadgeButton {...args} />
    </div>
  )
}

export const sfacActive = Template.bind({})
sfacActive.args = {
  active: true,
  icon: <SearchIcon />,
}

export const sfacInactive = Template.bind({})
sfacInactive.args = {
  active: false,
  icon: <SearchIcon />,
}

export const shacActive = Template.bind({})
shacActive.args = {
  active: true,
  icon: <ShoppingCart />,
}

export const shacInactive = Template.bind({})
shacInactive.args = {
  active: false,
  icon: <ShoppingCart />,
}
