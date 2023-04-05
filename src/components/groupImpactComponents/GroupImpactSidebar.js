import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Box from '@material-ui/core/Box'
import Stars from '@mui/icons-material/Stars'
import Fade from '@material-ui/core/Fade'
import Slide from '@material-ui/core/Slide'

// import StarsOutlined from '@material-ui/icons/StarsOutlined'
// import HealthAndSafetyOutlined from '@mui/icons-material/HealthAndSafetyOutlined'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Link from 'src/components/Link'
import { aboutURL, shopLandingURL } from 'src/utils/urls' // searchLandingURL
import clsx from 'clsx'
import {
  GROUP_IMPACT_SIDEBAR_STATE,

  // SFAC_ACTIVITY_STATES,
} from 'src/utils/constants'
import gtag from 'ga-gtag'
import { windowOpenTop } from 'src/utils/navigation'
import { lighten } from '@material-ui/core'
import VerticalLinearProgress from '../VerticalLinearProgress'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    transition: 'width .3s',
  },
  expanded: {
    width: 400,
  },
  closed: {
    width: 0,
  },
  expandedWrapper: {
    zIndex: 1e6,
    gridRowStart: 1,
    gridColumnStart: 1,
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    cursor: 'pointer',
    position: 'relative',
  },
  collapsedWrapper: {
    gridRowStart: 1,
    gridColumnStart: 1,
    top: 0,
    height: '100%',
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
    minHeight: 40,
    transition: 'width .3s',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  pullTabStar: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
  },
  pullTabCollapsed: {
    width: 76,
  },
  pullTabExpanded: {
    width: 84,
  },
  pullTabProgress: {
    fontWeight: 500,
  },
  nextGoalButton: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  sfacUpsell: {
    backgroundColor: lighten(theme.palette.primary.main, 0.62),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
  },
  shopUpsell: {
    backgroundColor: lighten(theme.palette.primary.main, 0.62),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
  },
  yesButton: {
    marginTop: theme.spacing(1),
    fontWeight: '700',
  },
}))

const GroupImpactSidebar = ({
  groupImpactSidebarState,
  groupImpactMetric,
  open,
  nextGoalButtonClickHandler,
  lastGroupImpactMetric,
  openHandler,

  // sfacActivityState,
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const [displaySidebarText, setDisplaySidebarText] = useState(true)
  const [displayingOldGoal, setDisplayingOldGoal] = useState(
    !!lastGroupImpactMetric
  )
  const [isClosedHover, setIsClosedHover] = useState(false)
  const { dollarProgress, dollarGoal, impactMetric } = displayingOldGoal
    ? lastGroupImpactMetric
    : groupImpactMetric
  const { impactTitle, whyValuableDescription } = impactMetric
  const classes = useStyles()
  const progress = Math.min(
    Math.round(100 * (dollarProgress / dollarGoal)),
    100
  )

  // const onYesClick = () => {
  //   gtag('event', 'group_impact_sidebar', {
  //     interaction: 'click_search_upsell',
  //   })
  //   windowOpenTop(searchLandingURL)
  // }

  const onYesShopClick = () => {
    gtag('event', 'group_impact_sidebar', {
      interaction: 'click_shop_upsell',
    })
    windowOpenTop(shopLandingURL)
  }

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  useEffect(() => {
    setDisplayingOldGoal(
      groupImpactSidebarState === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED &&
        lastGroupImpactMetric
    )
  }, [groupImpactSidebarState, lastGroupImpactMetric])

  const toggleOpen = (e) => {
    if (isOpen) {
      gtag('event', 'group_impact_sidebar', {
        interaction: 'close',
      })
    } else {
      gtag('event', 'group_impact_sidebar', {
        interaction: 'open',
      })
    }
    setIsOpen((prev) => !prev)
    openHandler()
    e.stopPropagation()
  }

  const onClickNextGoalButton = (e) => {
    gtag('event', 'group_impact_sidebar', {
      interaction: 'next_goal',
    })
    setDisplaySidebarText(false)
    setTimeout(() => {
      setDisplayingOldGoal(false)
      setDisplaySidebarText(true)
      nextGoalButtonClickHandler()
    }, 600)
    e.stopPropagation()
  }

  let wrapperWidthClass = classes.expanded
  if (!isOpen && isClosedHover) {
    wrapperWidthClass = classes.pullTabExpanded
  } else if (!isOpen) {
    wrapperWidthClass = classes.pullTabCollapsed
  }

  return (
    <div className={clsx(wrapperWidthClass, classes.wrapper)}>
      <Slide direction="right" in={isOpen}>
        <Box onClick={toggleOpen} className={classes.expandedWrapper}>
          <VerticalLinearProgress
            progress={[progress]}
            width={64}
            borderRadius={32}
            showMarkers
          />
          <Fade in={displaySidebarText} timeout={500}>
            <div className={classes.sidebarText}>
              <div className={classes.goalText}>
                <Typography className={classes.robotoBold} variant="h5">
                  GOAL
                </Typography>
                {groupImpactSidebarState ? (
                  <span className={classes.badge}>
                    {groupImpactSidebarState}
                  </span>
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
                How this Helps
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
              {displayingOldGoal && (
                <Button
                  className={classes.nextGoalButton}
                  variant="contained"
                  onClick={onClickNextGoalButton}
                >
                  Start Next Goal
                </Button>
              )}
              {/* {sfacActivityState !== SFAC_ACTIVITY_STATES.ACTIVE && (
                <div className={classes.sfacUpsell}>
                  <Typography>
                    You could triple your impact by raising money each time you
                    search. Try out our newest project: Search for a Cause
                    today!
                  </Typography>
                  <Button
                    onClick={onYesClick}
                    className={classes.yesButton}
                    variant="contained"
                  >
                    Learn More
                  </Button>
                </div>
              )} */}
              <div className={classes.shopUpsell}>
                <Typography>
                  You could triple your impact by raising money each time you
                  shop online. Try out our newest project: Shop for a Cause
                  today!
                </Typography>
                <Button
                  onClick={onYesShopClick}
                  className={classes.yesButton}
                  variant="contained"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </Fade>
        </Box>
      </Slide>
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
          <Typography variant="body2" className={classes.pullTabProgress}>
            {progress}%
          </Typography>
          <Stars className={classes.pullTabStar} />
        </div>
        <VerticalLinearProgress
          progress={[progress]}
          width={isClosedHover ? 24 : 8}
          borderRadius={0}
          showMarkers={false}
        />
      </Box>
    </div>
  )
}

GroupImpactSidebar.displayName = 'GroupImpactSidebar'
GroupImpactSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  groupImpactSidebarState: PropTypes.string,
  groupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired,
    impactMetric: PropTypes.shape({
      impactTitle: PropTypes.string.isRequired,
      whyValuableDescription: PropTypes.string.isRequired,
    }),
  }).isRequired,
  lastGroupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired,
    impactMetric: PropTypes.shape({
      impactTitle: PropTypes.string.isRequired,
      whyValuableDescription: PropTypes.string.isRequired,
    }),
  }),
  nextGoalButtonClickHandler: PropTypes.func,
  openHandler: PropTypes.func,

  // sfacActivityState: PropTypes.string,
}

GroupImpactSidebar.defaultProps = {
  groupImpactSidebarState: null,
  nextGoalButtonClickHandler: () => {},
  openHandler: () => {},
  lastGroupImpactMetric: null,

  // sfacActivityState: null,
}

export default GroupImpactSidebar
