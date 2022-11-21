import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import theme from 'src/utils/theme'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import StarsOutlined from '@material-ui/icons/StarsOutlined'
import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import VerticalLinearProgress from '../VerticalLinearProgress'

const useStyles = makeStyles(() => ({
  wrapper: {
    height: 600,
    width: 460,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  sidebarText: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarButtons: {
    display: 'flex',
    flexDirection: 'row',
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
    fontWeight: 900
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
    paddingTop: theme.spacing(.5),
    paddingBottom: theme.spacing(.5),
    borderRadius: '4px',
  },
  closeButton: {
    marginLeft: 'auto'
  }
}))

const GroupImpactSidebar = ({badgeText, participants, impactMetric, groupImpactMetric}) => {
  const {
    impactTitle,
    whyValuableDescription
  } = impactMetric
  const {
    dollarProgress,
    dollarGoal
  } = groupImpactMetric
  const classes = useStyles()
  const progress = Math.round(100 * (dollarProgress / dollarGoal))
  return (
    <div className={classes.wrapper}>
      <VerticalLinearProgress
        progress={progress}
        width={64}
        borderRadius={32}
        showMarkers
      />
      <div className={classes.sidebarText}>
        <div className={classes.goalText}>
          <Typography className={classes.robotoBold} variant="h5">GOAL</Typography>
          {badgeText ? <span className={classes.badge}>{badgeText}</span> : null}
          <Button className={classes.closeButton}><ArrowBackIos/></Button>
        </div>
        <Typography variant="body2">
          {impactTitle}
        </Typography>
        <Typography className={classes.robotoBold} variant="h3">{progress}%</Typography>
        <Typography variant="body2">completed</Typography>
        <Typography className={classes.robotoBold} variant="h6">{participants}</Typography>
        <Typography variant="body2">participants</Typography>
        <Divider className={classes.divider} />
        <Typography className={classes.robotoBold} variant="h6">Why it Matters</Typography>
        <Typography>
          {whyValuableDescription}
        </Typography>
        <Divider className={classes.divider} />
        <div className={classes.sidebarButtons}>
          <Button className={classes.sidebarButton}>
            <div className={classes.buttonContent}>
              <InfoIcon />
              <Typography className={classes.sidebarButtonText}>About the Cause</Typography>
            </div>
          </Button>
          <Button className={classes.sidebarButton}>
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
          </Button>
        </div>
        <Divider className={classes.divider} />
      </div>
    </div>
  )
}

GroupImpactSidebar.displayName = 'GroupImpactSidebar'
GroupImpactSidebar.propTypes = {
  badge: PropTypes.string,
  impactMetric: PropTypes.shape({
    impactTitle: PropTypes.string.isRequired,
    whyValuableDescription: PropTypes.string.isRequired,
  }).isRequired,
  groupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired
  }),
  participants: PropTypes.number.isRequired
}

GroupImpactSidebar.defaultProps = {
  badge: null,
}

export default GroupImpactSidebar
