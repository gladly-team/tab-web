import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import DashboardPopover from 'src/components/DashboardPopover'
import BadgeButton from 'src/components/BadgeButton'
import SfacActivityNotification from 'src/components/SfacActivityNotification'
import { SFAC_ACTIVITY_STATES } from 'src/utils/constants'
import SearchIcon from '@material-ui/icons/Search'

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

const SfacActivity = ({
  user: { cause = {}, searches, searchesToday, sfacActivityState },
}) => {
  const classes = useStyles()
  const { name: causeName } = cause
  const buttonRef = useRef(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  return (
    <div>
      <BadgeButton
        active={sfacActivityState === SFAC_ACTIVITY_STATES.ACTIVE}
        onClick={() => {
          setIsPopoverOpen(true)
        }}
        ref={buttonRef}
        icon={<SearchIcon />}
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
