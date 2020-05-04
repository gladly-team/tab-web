import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'

// TODO:
// - settings button on dashboard (gear?)
// - some tests for the dashboard
// - test account page content
// - test SettingsPage component

const useStyles = makeStyles(theme => ({
  contentContainer: {
    width: '100%',
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(3),
  },
  accountItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
  },
  accountItemName: {
    flex: 1,
    fontWeight: 'bold',
  },
  accountItemValue: {
    flex: 2,
  },
  accountItemActionButton: {
    flex: 2,
  },
}))

const AccountItem = props => {
  const { actionButton, name, value } = props
  const classes = useStyles()
  return (
    <div className={classes.accountItem}>
      <Typography variant="body2" className={classes.accountItemName}>
        {name}
      </Typography>
      {value ? (
        <Typography variant="body2" className={classes.accountItemValue}>
          {value}
        </Typography>
      ) : null}
      {actionButton ? (
        <div className={classes.accountItemActionButton}>{actionButton}</div>
      ) : null}
    </div>
  )
}

AccountItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  actionButton: PropTypes.element,
}

AccountItem.defaultProps = {
  actionButton: null,
}

const Account = props => {
  const { user } = props
  const { email, username } = user
  const classes = useStyles()
  return (
    <SettingsPage>
      <Paper elevation={1} className={classes.contentContainer}>
        <Typography variant="h5" className={classes.title}>
          Account
        </Typography>
        <Divider />
        <AccountItem name="Username" value={username || 'Not signed in'} />
        <Divider />
        <AccountItem name="Email" value={email || 'Not signed in'} />
      </Paper>
    </SettingsPage>
  )
}

Account.displayName = 'Account'
Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
}
Account.defaultProps = {
  user: {
    email: null,
    username: null,
  },
}

export default withAuthAndData(({ AuthUser }) => {
  const userId = AuthUser.id
  return {
    query: graphql`
      query containersIndexQuery($userId: String!) {
        user(userId: $userId) {
          email
          username
        }
      }
    `,
    variables: {
      userId,
    },
  }
})(Account)
