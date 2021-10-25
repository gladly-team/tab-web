import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SvgIcon from '@material-ui/core/SvgIcon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import {
  aboutURL,
  accountURL,
  dashboardURL,
  FINANCIALS_URL,
  HELP_URL,
  surveyLink,
} from 'src/utils/urls'
import { Divider } from '@material-ui/core'
import { mdiOpenInNew } from '@mdi/js'
import { areSameURLs } from 'src/utils/navigationUtils'

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
    marginTop: theme.spacing(1),
  },
  listItemIcon: {
    justifyContent: 'flex-end',
  },
  listItemIconSVG: {
    height: theme.typography.body1.fontSize,
    width: theme.typography.body1.fontSize,
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
    display: 'block',
    background: (props) => (props.isActive ? grey['300'] : 'inherit'),
  },
  sidebarContentContainer: {
    width: sidebarWidth,
    position: 'fixed',
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px',
  },
}))

const OpenInNew = ({ className }) => (
  <SvgIcon className={className}>
    <path d={mdiOpenInNew} />
  </SvgIcon>
)
OpenInNew.propTypes = {
  className: PropTypes.string,
}
OpenInNew.defaultProps = {
  className: undefined,
}

const SettingsMenuItem = (props) => {
  const { children, to, IconComponent, target } = props
  const router = useRouter()

  // We're using useEffect because `areSameURLs` may return
  // a different value on the client side and we don't want
  // a hydration mismatch. We can clean this up with a hook
  // that manages client-side-specific rendering.
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const isActive = areSameURLs(router.pathname, to) && isMounted

  const classes = useStyles({ isActive })
  return (
    <Link to={to} target={target} className={classes.menuItem}>
      <ListItem button>
        <ListItemText
          primary={children}
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
        {IconComponent && (
          <ListItemIcon className={classes.listItemIcon}>
            <IconComponent className={classes.listItemIconSVG} />
          </ListItemIcon>
        )}
      </ListItem>
    </Link>
  )
}

SettingsMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType,
  target: PropTypes.string,
}
SettingsMenuItem.defaultProps = {
  IconComponent: null,
  target: undefined,
}

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
          <SettingsMenuItem to={accountURL}>Account</SettingsMenuItem>
          <SettingsMenuItem to={aboutURL}>About the Cause</SettingsMenuItem>
          <Divider className={classes.divider} />
          <SettingsMenuItem
            to={HELP_URL}
            IconComponent={OpenInNew}
            target="_blank"
          >
            Help
          </SettingsMenuItem>
          <SettingsMenuItem
            to={FINANCIALS_URL}
            IconComponent={OpenInNew}
            target="_blank"
          >
            Our Financials
          </SettingsMenuItem>
          <SettingsMenuItem
            to={surveyLink}
            IconComponent={OpenInNew}
            target="_blank"
          >
            Feedback
          </SettingsMenuItem>
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
  children: PropTypes.node,
}
SettingsPage.defaultProps = {
  children: null,
}

export default SettingsPage
