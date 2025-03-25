import React from 'react'
import { flowRight } from 'lodash/util'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { withSentry } from 'src/utils/pageWrappers/withSentry'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import FirebaseAuth from 'src/components/FirebaseAuth'
import Logo from 'src/components/Logo'
import useData from 'src/utils/hooks/useData'
import MoneyRaisedContainer from 'src/components/MoneyRaisedContainer'
import { graphql } from 'react-relay'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  container: {
    background: grey['50'],
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 40,
    margin: '20px 40px',
  },
  loginContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  quoteContainer: {
    margin: theme.spacing(3),
  },
  quote: {
    fontWeight: 'bold',
  },
  quoteAttribution: {},
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
  },
}))

const getRelayQuery = () => ({
  query: graphql`
    query authQuery {
      app {
        ...MoneyRaisedContainer_app
      }
    }
  `,
})

const Auth = ({ data: initialData }) => {
  const classes = useStyles()
  const { data } = useData({ getRelayQuery, initialData })
  const fetchInProgress = !data
  console.log(fetchInProgress)
  const { app } = data || {}
  return (
    <div className={classes.container}>
      { !fetchInProgress &&
        <div className={classes.topContainer}>
          <Logo includeText className={classes.logo} />
          <Typography variant="h5">
            <MoneyRaisedContainer app={app} />
          </Typography>
        </div>
      }
      <div className={classes.loginContainer}>
        <FirebaseAuth />
      </div>
      <div className={classes.quoteContainer}>
        <Typography
          variant="h5"
          align="center"
          className={classes.quote}
          gutterBottom
        >
          "One of the simplest ways to raise money"
        </Typography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          className={classes.quoteAttribution}
        >
          - USA Today
        </Typography>
      </div>
    </div>
  )
}

Auth.displayName = 'Auth'

Auth.propTypes = {
  data: PropTypes.shape({
    app: PropTypes.shape({}).isRequired,
  }),
}

Auth.defaultProps = {
  data: undefined,
}

export default flowRight([
  withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  }),
  withSentry,
  withRelay,
])(Auth)
