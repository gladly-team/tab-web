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
import moment from 'moment'

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
    width: '100px',
  },
}))
const GroupImpactContributionRow = ({ userGroupImpactMetricLog }) => {
  const estimatedMicroUsdsPerTab = Math.max(
    getEstimatedMoneyRaisedPerTab() * 10 ** 6,
    1
  )
  const classes = useStyles()
  const {
    dateStarted,
    dollarContribution,
    tabDollarContribution,
    searchDollarContribution,
    shopDollarContribution,
    referralDollarContribution,
  } = userGroupImpactMetricLog
  const impactPoints = Math.ceil(
    dollarContribution / estimatedMicroUsdsPerTab
  ).toLocaleString('en-US')
  const dateStartedString = moment(dateStarted).format('l')
  return (
    <div className={classes.wrapper}>
      <Typography className={classes.position} variant="h6">
        {dateStartedString}
      </Typography>
      <div className={classes.column}>
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

GroupImpactContributionRow.propTypes = {
  userGroupImpactMetricLog: PropTypes.shape({
    dollarContribution: PropTypes.number.isRequired,
    tabDollarContribution: PropTypes.number,
    searchDollarContribution: PropTypes.number,
    shopDollarContribution: PropTypes.number,
    referralDollarContribution: PropTypes.number,
    dateStarted: PropTypes.string,
  }).isRequired,
}

export default GroupImpactContributionRow
