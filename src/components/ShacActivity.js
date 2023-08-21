import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import DashboardPopover from 'src/components/DashboardPopover'
import BadgeButton from 'src/components/BadgeButton'
import ShacActivityNotification from 'src/components/ShacActivityNotification'
import { SHAC_ACTIVITY_STATES } from 'src/utils/constants'
import { ShoppingCart } from '@mui/icons-material'

const useStyles = makeStyles(() => ({
  popover: {
    // Match other popovers in the user menu
    marginTop: 9,
  },
  popoverPaper: {
    borderRadius: 15,
  },
  popoverContent: {
    width: 400,
  },
}))

const ShacActivity = ({
  user: { cause = {}, shacTotalEarned, shacActivityState },
}) => {
  const classes = useStyles()
  const { name: causeName } = cause
  const buttonRef = useRef(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  return (
    <div>
      <BadgeButton
        active={shacActivityState === SHAC_ACTIVITY_STATES.ACTIVE}
        onClick={() => {
          setIsPopoverOpen(true)
        }}
        ref={buttonRef}
        icon={<ShoppingCart />}
      />
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={buttonRef.current}
        onClose={() => {
          setIsPopoverOpen(false)
        }}
        className={classes.popover}
        PaperProps={{
          classes: {
            root: classes.popoverPaper,
          },
        }}
      >
        <ShacActivityNotification
          className={classes.popoverContent}
          activityState={shacActivityState}
          totalEarned={shacTotalEarned || 0}
          impactName={causeName}
        />
      </DashboardPopover>
    </div>
  )
}

ShacActivity.propTypes = {
  user: PropTypes.shape({
    cause: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    shacTotalEarned: PropTypes.number.isRequired,
    shacActivityState: PropTypes.string.isRequired,
  }).isRequired,
}

ShacActivity.defaultProps = {}

export default ShacActivity
