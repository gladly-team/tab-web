import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Logo from 'src/components/Logo'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    margin: 0,
    padding: '0px 0px 140px 0px',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  logo: {
    height: 34,
    width: 34,
    padding: theme.spacing(2),
    boxSizing: 'content-box',
  },
}))

const FullPageLoader = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Logo className={classes.logo} />
      <Typography variant="h5">Loading...</Typography>
    </div>
  )
}

FullPageLoader.propTypes = {}
FullPageLoader.defaultProps = {}

export default FullPageLoader
