import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'

const useStyles = makeStyles(theme => ({
  contentContainer: {
    width: '100%',
    margin: theme.spacing(2),
  },
}))

const AccountItem = props => {
  const { actionButton, name, value } = props
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Typography variant="body2" style={{ flex: 1, fontWeight: 'bold' }}>
        {name}
      </Typography>
      {value ? (
        <Typography variant="body2" style={{ flex: 2 }}>
          {value}
        </Typography>
      ) : null}
      {actionButton ? <div style={{ flex: 2 }}>{actionButton}</div> : null}
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
        <Typography variant="h5" style={{ padding: 20 }}>
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
