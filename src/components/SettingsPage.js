import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import Logo from 'src/components/Logo'

const sidebarWidth = 240
const useStyles = makeStyles(() => ({
  container: {
    minWidth: '100vw',
    minHeight: '100vh',
  },
  closeIcon: {
    color: '#fff',
    width: 28,
    height: 28,
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

const SettingsPage = props => {
  const { mainContent, onClose, sidebarContent } = props
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
      <div className={classes.sidebarContentContainer}>{sidebarContent}</div>
      <div className={classes.mainContentContainer}>{mainContent}</div>
    </div>
  )
}

SettingsPage.propTypes = {
  mainContent: PropTypes.node.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SettingsPage
