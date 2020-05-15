import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
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
import { accountURL, achievementsURL, dashboardURL } from 'src/utils/urls'

const sidebarWidth = 240
const useStyles = makeStyles((theme) => ({
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
    marginLeft: theme.spacing(1),
  },
  listSubheader: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoContainer: { flex: 1 },
  mainContentContainer: {
    marginLeft: sidebarWidth,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  menuItem: {
    background: (props) => (props.isActive ? grey['300'] : 'inherit'),
  },
  sidebarContentContainer: {
    width: sidebarWidth,
    position: 'fixed',
  },
}))

const SettingsMenuItem = (props) => {
  const { children, to } = props
  const router = useRouter()
  const isActive = router.pathname === to
  const classes = useStyles({ isActive })
  return (
    <Link to={to} className={classes.menuItem}>
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

const SettingsPage = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <AppBar color="primary" position="sticky">
        <Toolbar>
          <div className={classes.logoContainer}>
            <Logo color="white" className={classes.logo} />
          </div>
          <Link to={dashboardURL} className={classes.menuItem}>
            <IconButton>
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={classes.sidebarContentContainer}>
        <List className={classes.list}>
          <ListSubheader disableSticky className={classes.listSubheader}>
            Your Profile
          </ListSubheader>
          <SettingsMenuItem to={achievementsURL}>Achievements</SettingsMenuItem>
          <SettingsMenuItem to={accountURL}>Account</SettingsMenuItem>
        </List>
      </div>
      <div
        data-test-id="settings-content"
        className={classes.mainContentContainer}
      >
        {children}
      </div>
    </div>
  )
}

SettingsPage.displayName = 'SettingsPage'
SettingsPage.propTypes = {
  children: PropTypes.node.isRequired,
}
SettingsPage.defaultProps = {}

export default SettingsPage
