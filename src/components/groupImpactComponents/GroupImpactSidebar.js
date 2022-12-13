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
import Fade from '@material-ui/core/Fade'

// import StarsOutlined from '@material-ui/icons/StarsOutlined'
// import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Link from 'src/components/Link'
import { aboutURL } from 'src/utils/urls'
import clsx from 'clsx'
import VerticalLinearProgress from '../VerticalLinearProgress'

const useStyles = makeStyles(() => ({
  wrapper: {
    height: '100%',
    width: 400,
  },
  expandedWrapper: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    cursor: 'pointer',
  },
  collapsedWrapper: {
    height: '100%',
    width: 100,
    paddingTop: theme.spacing(2),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sidebarButton: {
    flex: '1 1 0',
    textTransform: 'none',
    borderRadius: '8px',
    padding: theme.spacing(1.5),
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
    borderRadius: '8px',
    marginLeft: 'auto',
  },
  closeButtonIcon: {
    width: 40,
    height: 40,
    marginRight: '-16px',
  },
  pullTab: {
    height: 40,
    transition: 'width .3s',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  pullTabStar: {
    color: '#FF6A08',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
  },
  pullTabCollapsed: {
    width: 62,
  },
  pullTabExpanded: {
    width: 72,
  },
  pullTabProgress: {
    fontWeight: 500,
  },
  nextGoalButton: {
    fontWeight: 700,
  },
}))

const GroupImpactSidebar = ({
  badgeText,
  impactMetric,
  groupImpactMetric,
  open,
  nextGoalButtonClickHandler,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const [isClosedHover, setIsClosedHover] = useState(false)
  const { impactTitle, whyValuableDescription } = impactMetric
  const { dollarProgress, dollarGoal } = groupImpactMetric
  const classes = useStyles()
  const progress = Math.round(100 * (dollarProgress / dollarGoal))

  const toggleOpen = (e) => {
    setIsOpen((prev) => !prev)
    e.stopPropagation()
  }

  return (
    <div className={classes.wrapper}>
      {isOpen ? (
        <Box onClick={toggleOpen} className={classes.expandedWrapper}>
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
                <ArrowBackIos className={classes.closeButtonIcon} />
              </Button>
            </div>
            <Typography variant="body2">{impactTitle}</Typography>
            <Typography className={classes.robotoBold} variant="h3">
              {progress}%
            </Typography>
            <Typography variant="body2">completed</Typography>
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
            {nextGoalButtonClickHandler && (
              <Button
                className={classes.nextGoalButton}
                variant="contained"
                onClick={nextGoalButtonClickHandler}
              >
                Start Next Goal
              </Button>
            )}
          </div>{' '}
        </Box>
      ) : (
        <Box
          onClick={toggleOpen}
          className={classes.collapsedWrapper}
          onMouseOver={() => setIsClosedHover(true)}
          onMouseOut={() => setIsClosedHover(false)}
        >
          <div
            className={
              isClosedHover
                ? clsx(classes.pullTab, classes.pullTabExpanded)
                : clsx(classes.pullTab, classes.pullTabCollapsed)
            }
          >
            <Fade in={isClosedHover}>
              <Typography variant="body2" className={classes.pullTabProgress}>
                {progress}%
              </Typography>
            </Fade>
            <Stars className={classes.pullTabStar} />
          </div>
          <VerticalLinearProgress
            progress={progress}
            width={isClosedHover ? 24 : 8}
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
  open: PropTypes.bool.isRequired,
  badgeText: PropTypes.string,
  impactMetric: PropTypes.shape({
    impactTitle: PropTypes.string.isRequired,
    whyValuableDescription: PropTypes.string.isRequired,
  }).isRequired,
  groupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired,
  }).isRequired,
  nextGoalButtonClickHandler: PropTypes.func,
}

GroupImpactSidebar.defaultProps = {
  badgeText: null,
  nextGoalButtonClickHandler: null,
}

export default GroupImpactSidebar
