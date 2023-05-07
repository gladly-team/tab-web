import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import TabIcon from '@material-ui/icons/Tab'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import clsx from 'clsx'
import defaultTheme from 'src/utils/theme'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
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
  numberIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '100%',
    backgroundColor: defaultTheme.palette.colors.tab,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    color: 'white',
  },
  impactPoints: {
    marginLeft: 'auto',
  },
  selected: {
    backgroundColor: defaultTheme.palette.primary.main,
  },
}))
const GroupImpactLeaderboardRow = ({
  position,
  username,
  userGroupImpactMetric,
  selected,
}) => {
  const classes = useStyles()
  const {
    dollarContribution,
    tabDollarContribution,
    searchDollarContribution,
    shopDollarContribution,
  } = userGroupImpactMetric
  return (
    <div
      className={
        selected ? clsx(classes.wrapper, classes.selected) : classes.wrapper
      }
    >
      <div className={classes.numberIcon}>
        <Typography variant="h5">{position}</Typography>
      </div>
      <div className={classes.column}>
        <Typography className={classes.bold} variant="h6">
          {username}
        </Typography>
        <div className={classes.impactIcons}>
          {(tabDollarContribution || tabDollarContribution > 0) && (
            <div className={clsx(classes.tabIcon, classes.iconWrapper)}>
              <TabIcon className={classes.icon} />
            </div>
          )}
          {(searchDollarContribution || searchDollarContribution > 0) && (
            <div className={clsx(classes.searchIcon, classes.iconWrapper)}>
              <SearchIcon className={classes.icon} />
            </div>
          )}
          {(shopDollarContribution || shopDollarContribution > 0) && (
            <div className={clsx(classes.shopIcon, classes.iconWrapper)}>
              <ShoppingCartIcon className={classes.icon} />
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(classes.impactPoints, classes.column, classes.center)}
      >
        <Typography className={classes.bold} variant="h6">
          {dollarContribution}
        </Typography>
        <Typography variant="h6">Impact Points</Typography>
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
  }).isRequired,
}

GroupImpactLeaderboardRow.defaultProps = {
  selected: false,
}

export default GroupImpactLeaderboardRow
