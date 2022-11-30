import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'
import { GET_SEARCH_URL, SFAC_FEEDBACK_LINK } from 'src/utils/urls'
import Link from 'src/components/Link'
import Notification from './Notification'

const statusIconSize = 18

const useStyles = makeStyles((theme) => ({
  notification: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: 15,
  },
  noButton: {
    fontWeight: '500',
  },
  yesButton: {
    fontWeight: '900',
    marginLeft: theme.spacing(1),
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
  },
  text: {
    paddingBottom: theme.spacing(3.5),
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  active: {
    color: '#219653',
  },
  inactive: {
    color: '#E3720E',
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.spacing(2.5),
  },
  statusWrapper: {
    paddingBottom: theme.spacing(2.5),
  },
  searchCountContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  searchCountSubContainer: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
  statusText: {
    paddingRight: theme.spacing(0.5),
    fontWeight: 700,
  },
  searchCount: {
    fontWeight: 900,
  },
  statusIcon: {
    height: statusIconSize,
    width: statusIconSize,
  },
}))
const SfacExtensionSellNotification = ({
  className,
  activityState,
  searchesToday,
  totalSearches,
  impactName,
}) => {
  const classes = useStyles()
  let buttons = null
  if (activityState === 'inactive') {
    buttons = (
      <div className={classes.buttonsWrapper}>
        <Link to={SFAC_FEEDBACK_LINK} target="_blank" rel="noopener noreferrer">
          <Button className={classes.noButton}>Feedback</Button>
        </Link>
        <Link to={GET_SEARCH_URL} target="_blank" rel="noopener noreferrer">
          <Button
            className={classes.yesButton}
            variant="contained"
            disableElevation
          >
            Activate Extension
          </Button>
        </Link>
      </div>
    )
  } else if (activityState === 'new') {
    buttons = (
      <div className={classes.buttonsWrapper}>
        <Link to={GET_SEARCH_URL} target="_blank" rel="noopener noreferrer">
          <Button
            className={classes.yesButton}
            variant="contained"
            disableElevation
          >
            Get it Now
          </Button>
        </Link>
      </div>
    )
  }
  return (
    <div className={className}>
      <Notification
        open
        text={
          <span className={classes.text}>
            <Typography variant="h2" className={classes.title}>
              Search for a Cause
            </Typography>
            {activityState === 'active' ? (
              <div className={classes.statusWrapper}>
                <div className={`${classes.active} ${classes.status}`}>
                  <Typography className={classes.statusText} variant="body1">
                    Active
                  </Typography>
                  <CheckCircleIcon
                    style={{ width: statusIconSize, height: statusIconSize }}
                    className={classes.statusIcon}
                  />
                </div>
                <Typography variant="body1">
                  Your searches are raising up to 4x more for {impactName} than
                  just opening tabs. Great job!
                </Typography>
              </div>
            ) : (
              <div className={classes.statusWrapper}>
                <div className={`${classes.inactive} ${classes.status}`}>
                  <Typography className={classes.statusText} variant="body1">
                    Inactive
                  </Typography>
                  <DoNotDisturbOnIcon
                    style={{ width: statusIconSize, height: statusIconSize }}
                    className={classes.statusIcon}
                  />
                </div>
                {activityState === 'inactive' ? (
                  <Typography variant="body1">
                    You haven’t used Search for Cause in a while! Searching
                    raises up to 4x more for {impactName} than just opening
                    tabs.
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    You can do even more good with our Search for a Cause
                    extension. Searching raises up to 4x more for {impactName}{' '}
                    than just opening tabs.
                  </Typography>
                )}
              </div>
            )}
            <span className={classes.searchCountContainer}>
              <div className={classes.searchCountSubContainer}>
                <Typography className={classes.searchCount} variant="h5">
                  {searchesToday}
                </Typography>
                <Typography variant="body1">Searches Today</Typography>
              </div>
              <div className={classes.searchCountSubContainer}>
                <Typography className={classes.searchCount} variant="h5">
                  {totalSearches}
                </Typography>
                <Typography variant="body1">Total Searches</Typography>
              </div>
            </span>
          </span>
        }
        includeButton={activityState !== 'active'}
        buttons={buttons}
        className={classes.notification}
      />
    </div>
  )
}

SfacExtensionSellNotification.propTypes = {
  className: PropTypes.string,
  activityState: PropTypes.string.isRequired,
  searchesToday: PropTypes.number.isRequired,
  totalSearches: PropTypes.number.isRequired,
  impactName: PropTypes.string.isRequired,
}

SfacExtensionSellNotification.defaultProps = {
  className: '',
}

export default SfacExtensionSellNotification
