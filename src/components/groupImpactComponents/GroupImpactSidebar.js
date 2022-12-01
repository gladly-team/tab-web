import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import theme from 'src/utils/theme'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Box from '@material-ui/core/Box'
import Stars from '@mui/icons-material/Stars'

// import StarsOutlined from '@material-ui/icons/StarsOutlined'
// import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Link from 'src/components/Link'
import { aboutURL } from 'src/utils/urls'
import VerticalLinearProgress from '../VerticalLinearProgress'

const useStyles = makeStyles(() => ({
  wrapper: {
    height: 600,
    width: 400,
    backgroundcolor: 'transparent',
  },
  expandedWrapper: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  collapsedWrapper: {
    height: '100%',
    width: '100%',
    paddingTop: '10px',
  },
  sidebarText: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  sidebarButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sidebarButton: {
    flex: '1 1 0',
    textTransform: 'none',
  },
  sidebarButtonText: {
    fontSize: '14px',
  },
  robotoBold: {
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 900,
  },
  goalText: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'black',
    color: 'white',
    marginLeft: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    borderRadius: '4px',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  pullTab: {
    width: 72,
    height: 40,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  pullTabStar: {
    marginLeft: 34,
    color: '#FF6A08',
  },
}))

const GroupImpactSidebar = ({
  badgeText,
  participants,
  impactMetric,
  groupImpactMetric,
}) => {
  const [open, setOpen] = useState(true)
  const { impactTitle, whyValuableDescription } = impactMetric
  const { dollarProgress, dollarGoal } = groupImpactMetric
  const classes = useStyles()
  const progress = Math.round(100 * (dollarProgress / dollarGoal))

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <div
      className={classes.wrapper}
      style={{
        width: open ? '400px' : '72px',
      }}
    >
      {open ? (
        <div className={classes.expandedWrapper}>
          <VerticalLinearProgress
            progress={progress}
            width={64}
            borderRadius={32}
            showMarkers
          />
          <div className={classes.sidebarText}>
            <div className={classes.goalText}>
              <Typography className={classes.robotoBold} variant="h5">
                GOAL
              </Typography>
              {badgeText ? (
                <span className={classes.badge}>{badgeText}</span>
              ) : null}
              <Button onClick={toggleOpen} className={classes.closeButton}>
                <ArrowBackIos />
              </Button>
            </div>
            <Typography variant="body2">{impactTitle}</Typography>
            <Typography className={classes.robotoBold} variant="h3">
              {progress}%
            </Typography>
            <Typography variant="body2">completed</Typography>
            <Typography className={classes.robotoBold} variant="h6">
              {participants}
            </Typography>
            <Typography variant="body2">participants</Typography>
            <Divider className={classes.divider} />
            <Typography className={classes.robotoBold} variant="h6">
              Why it Matters
            </Typography>
            <Typography>{whyValuableDescription}</Typography>
            <Divider className={classes.divider} />
            <div className={classes.sidebarButtons}>
              <Link to={aboutURL}>
                <Button className={classes.sidebarButton}>
                  <div className={classes.buttonContent}>
                    <InfoIcon />
                    <Typography className={classes.sidebarButtonText}>
                      About the Cause
                    </Typography>
                  </div>
                </Button>
              </Link>
              {/* <Button className={classes.sidebarButton}>
            <div className={classes.buttonContent}>
              <StarsOutlined />
              <Typography className={classes.sidebarButtonText}>Impact</Typography>
            </div>
          </Button>
          <Button className={classes.sidebarButton}>
            <div className={classes.buttonContent}>
              <HealthAndSafetyOutlined />
              <Typography className={classes.sidebarButtonText}>Nonprofits</Typography>
            </div>
            </Button> */}
            </div>
            <Divider className={classes.divider} />
          </div>{' '}
        </div>
      ) : (
        <Box onClick={toggleOpen} className={classes.collapsedWrapper}>
          <div className={classes.pullTab}>
            <Stars className={classes.pullTabStar} />
          </div>
          <VerticalLinearProgress
            progress={progress}
            width={8}
            borderRadius={0}
            showMarkers={false}
          />
        </Box>
      )}
    </div>
  )
}

GroupImpactSidebar.displayName = 'GroupImpactSidebar'
GroupImpactSidebar.propTypes = {
  badgeText: PropTypes.string,
  impactMetric: PropTypes.shape({
    impactTitle: PropTypes.string.isRequired,
    whyValuableDescription: PropTypes.string.isRequired,
  }).isRequired,
  groupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired,
  }).isRequired,
  participants: PropTypes.number.isRequired,
}

GroupImpactSidebar.defaultProps = {
  badgeText: null,
}

export default GroupImpactSidebar
