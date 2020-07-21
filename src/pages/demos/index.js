import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import return404If from 'src/utils/pageWrappers/return404If'
import { showDevelopmentOnlyDemoPages } from 'src/utils/featureFlags'
import Link from 'src/components/Link'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  header: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(4),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}))

const DemosIndexPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h3" gutterBottom>
          Demos
        </Typography>
        <ul>
          <li>
            <Typography variant="body1" gutterBottom>
              <Link to="/demos/achievement-component" className={classes.link}>
                Achievement component
              </Link>
              : AKA "goals"
            </Typography>
          </li>
        </ul>
      </div>
    </div>
  )
}

DemosIndexPage.displayName = 'DemosIndexPage'
DemosIndexPage.propTypes = {}
DemosIndexPage.defaultProps = {}

export default return404If(!showDevelopmentOnlyDemoPages())(DemosIndexPage)
