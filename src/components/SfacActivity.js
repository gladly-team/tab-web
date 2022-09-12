import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import SfacActivityButton from 'src/components/SfacActivityButton'
import SfacActivityNotification from 'src/components/SfacActivityNotification'
import DashboardPopover from 'src/components/DashboardPopover'
import { SFAC_ACTIVITY_STATES } from 'src/utils/constants'

const useStyles = makeStyles(() => ({
  popover: {
    // Match other popovers in the user menu
    marginTop: 9,
  },
  popoverContent: {
    width: 400,
  },
}))

const SfacActivity = ({
  user: { cause = {}, searches, searchesToday, sfacActivityState },
}) => {
  const classes = useStyles()
  const { name: causeName } = cause
  const buttonRef = useRef(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  return (
    <div>
      <SfacActivityButton
        active={sfacActivityState === SFAC_ACTIVITY_STATES.ACTIVE}
        onClick={() => {
          setIsPopoverOpen(true)
        }}
        ref={buttonRef}
      />
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={buttonRef.current}
        onClose={() => {
          setIsPopoverOpen(false)
        }}
        className={classes.popover}
      >
        <SfacActivityNotification
          className={classes.popoverContent}
          activityState={sfacActivityState}
          searchesToday={searchesToday || 0}
          totalSearches={searches || 0}
          impactName={causeName}
        />
      </DashboardPopover>
    </div>
  )
}

SfacActivity.propTypes = {
  user: PropTypes.shape({
    cause: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    searches: PropTypes.number.isRequired,
    searchesToday: PropTypes.number.isRequired,
    sfacActivityState: PropTypes.string.isRequired,
  }).isRequired,
}

SfacActivity.defaultProps = {}

export default SfacActivity
