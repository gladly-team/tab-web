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
}))

const Auth = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Logo includeText className={classes.logo} />
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

Auth.propTypes = {}

Auth.defaultProps = {}

export default flowRight([
  withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  }),
  withSentry,
  withRelay,
])(Auth)
