import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import { settingsAccountURL } from 'src/utils/urls'

const sidebarWidth = 240
const useStyles = makeStyles(() => ({
  container: {
    minWidth: '100vw',
    minHeight: '100vh',
    background: grey['100'],
  },
  closeIcon: {
    color: '#fff',
    width: 28,
    height: 28,
  },
  list: {
    marginLeft: 14,
  },
  listSubheader: {
    textTransform: 'uppercase',
  },
  logo: {
    width: 40,
    height: 40,
  },
  mainContentContainer: {
    marginLeft: sidebarWidth,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  sidebarContentContainer: {
    width: sidebarWidth,
    position: 'fixed',
  },
}))

const SettingsMenuItem = props => {
  const { children, to } = props
  return (
    <Link to={to}>
      <ListItem button>
        <ListItemText
          primary={children}
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItem>
    </Link>
  )
}

SettingsMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
}

SettingsMenuItem.defaultProps = {}

const SettingsPage = props => {
  const { mainContent, onClose } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <AppBar color="primary" position="sticky">
        <Toolbar>
          <div style={{ flex: 1 }}>
            <Logo color="white" className={classes.logo} />
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.sidebarContentContainer}>
        <List className={classes.list}>
          <ListSubheader disableSticky className={classes.listSubheader}>
            Settings
          </ListSubheader>
          <SettingsMenuItem to={settingsAccountURL}>Account</SettingsMenuItem>
        </List>
      </div>
      <div className={classes.mainContentContainer}>{mainContent}</div>
    </div>
  )
}

SettingsPage.propTypes = {
  mainContent: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

SettingsPage.defaultProps = {}

export default SettingsPage
