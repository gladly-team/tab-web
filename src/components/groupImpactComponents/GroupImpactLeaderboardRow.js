import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import TabIcon from '@material-ui/icons/Tab'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import clsx from 'clsx'
import defaultTheme from 'src/utils/theme'
import { lighten } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import { getEstimatedMoneyRaisedPerTab } from 'src/utils/misc'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  iconWrapper: {
    height: '24px',
    width: '24px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(0.5),
  },
  tabIcon: {
    backgroundColor: defaultTheme.palette.colors.tab,
  },
  searchIcon: {
    backgroundColor: defaultTheme.palette.colors.search,
  },
  shopIcon: {
    backgroundColor: defaultTheme.palette.colors.shop,
  },
  referralIcon: {
    backgroundColor: defaultTheme.palette.colors.referral,
  },
  impactIcons: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    height: '16px',
    width: '16px',
    color: 'white',
  },
  bold: {
    fontWeight: '700',
  },
  impactPoints: {
    marginLeft: 'auto',
  },
  selected: {
    backgroundColor: lighten(theme.palette.primary.main, 0.62),
  },
  tooltips: {
    zIndex: '9999999 !important',
  },
  position: {
    marginRight: theme.spacing(2),
    width: '90px',
  },
}))
const GroupImpactLeaderboardRow = ({
  position,
  username,
  userGroupImpactMetric,
  selected,
}) => {
  const estimatedMicroUsdsPerTab = Math.max(
    getEstimatedMoneyRaisedPerTab() * 10 ** 6,
    1
  )
  const classes = useStyles()
  const {
    dollarContribution,
    tabDollarContribution,
    searchDollarContribution,
    shopDollarContribution,
    referralDollarContribution,
  } = userGroupImpactMetric
  const impactPoints = Math.ceil(
    dollarContribution / estimatedMicroUsdsPerTab
  ).toLocaleString('en-US')
  return (
    <div
      className={
        selected ? clsx(classes.wrapper, classes.selected) : classes.wrapper
      }
    >
      <Typography className={classes.position} variant="h5">
        {position}
      </Typography>
      <div className={classes.column}>
        <Typography className={classes.bold} variant="h6">
          {username}
        </Typography>
        <div className={classes.impactIcons}>
          {(tabDollarContribution || tabDollarContribution > 0) && (
            <div className={clsx(classes.tabIcon, classes.iconWrapper)}>
              <Tooltip
                title="This user uses Tab for a Cause"
                classes={{
                  popper: classes.tooltips,
                }}
              >
                <TabIcon className={classes.icon} />
              </Tooltip>
            </div>
          )}
          {(searchDollarContribution || searchDollarContribution > 0) && (
            <div className={clsx(classes.searchIcon, classes.iconWrapper)}>
              <Tooltip
                title="This user uses Search for a Cause"
                classes={{
                  popper: classes.tooltips,
                }}
              >
                <SearchIcon className={classes.icon} />
              </Tooltip>
            </div>
          )}
          {(shopDollarContribution || shopDollarContribution > 0) && (
            <div className={clsx(classes.shopIcon, classes.iconWrapper)}>
              <Tooltip
                title="This user uses Shop for a Cause"
                classes={{
                  popper: classes.tooltips,
                }}
              >
                <ShoppingCartIcon className={classes.icon} />
              </Tooltip>
            </div>
          )}
          {(referralDollarContribution || referralDollarContribution > 0) && (
            <div className={clsx(classes.referralIcon, classes.iconWrapper)}>
              <Tooltip
                title="This user has referred other users"
                classes={{
                  popper: classes.tooltips,
                }}
              >
                <GroupAddIcon className={classes.icon} />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(classes.impactPoints, classes.column, classes.center)}
      >
        <Typography className={classes.bold} variant="h6">
          {impactPoints}
        </Typography>
      </div>
    </div>
  )
}

GroupImpactLeaderboardRow.propTypes = {
  selected: PropTypes.bool,
  position: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  userGroupImpactMetric: PropTypes.shape({
    dollarContribution: PropTypes.number.isRequired,
    tabDollarContribution: PropTypes.number,
    searchDollarContribution: PropTypes.number,
    shopDollarContribution: PropTypes.number,
    referralDollarContribution: PropTypes.number,
  }).isRequired,
}

GroupImpactLeaderboardRow.defaultProps = {
  selected: false,
}

export default GroupImpactLeaderboardRow
