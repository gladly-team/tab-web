import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useInterval from 'src/utils/hooks/useInterval'
import { currencyFormatUSD } from 'src/utils/formatting'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import DashboardPopover from 'src/components/DashboardPopover'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  currencyText: { color: get(theme, 'palette.backgroundContrastText.main') },
  popover: { marginTop: 9 },
  popoverText: {
    padding: 12,
    width: 220,
  },
}))
const MoneyRaised = (props) => {
  const {
    app: { dollarsPerDayRate, moneyRaised },
  } = props
  const classes = useStyles()
  const [currentMoneyRaised, setMoneyRaised] = useState(moneyRaised)

  // If the moneyRaised prop changes, use the new value.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  const [prevMoneyRaised, setPrevMoneyRaised] = useState(moneyRaised)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const spanRef = useRef(undefined)

  if (moneyRaised !== prevMoneyRaised) {
    setMoneyRaised(moneyRaised)
    setPrevMoneyRaised(moneyRaised)
  }

  // Add a penny every X number of seconds.
  const msInDay = 864e5
  const msPerPenny = msInDay / (dollarsPerDayRate * 100)
  useInterval(() => {
    setMoneyRaised(currentMoneyRaised + 0.01)
  }, msPerPenny)

  return (
    <div>
      <Button ref={spanRef} onClick={() => setIsPopoverOpen(true)}>
        <Typography variant="h5" className={classes.currencyText}>
          {currencyFormatUSD(currentMoneyRaised)}
        </Typography>
      </Button>
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={spanRef.current}
        onClose={() => {
          setIsPopoverOpen(false)
        }}
        className={classes.popover}
      >
        <div className={classes.popoverText}>
          <Typography
            variant="body1"
            className={classes.dropdownText}
            gutterBottom
          >
            We've raised this together
          </Typography>
          <Typography
            variant="body2"
            className={classes.dropdownText}
            gutterBottom
          >
            This is the total our community has raised for nonprofits all over
            the world. Thank you!
          </Typography>
        </div>
      </DashboardPopover>
    </div>
  )
}

MoneyRaised.displayName = 'MoneyRaised'
MoneyRaised.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired,
  }).isRequired,
}
MoneyRaised.defaultProps = {}

export default MoneyRaised
