import React, { useRef, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import PetsIcon from '@material-ui/icons/Pets'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DashboardPopover from 'src/components/DashboardPopover'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(() => ({
  root: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px grey',
    borderRadius: '30px',
    padding: '0px',
    '&:hover': {
      background: 'white',
    },
  },
  petsIcon: {
    position: 'relative',
    marginLeft: '-32px',
    marginRight: '8px',
  },
  counter: {
    marginRight: '14px',
    marginLeft: '14px',
  },
  popoverText: {
    padding: 12,
    width: 220,
  },
  popover: { marginTop: 10 },
}))

const ImpactCounter = (props) => {
  const classes = useStyles()

  const { includeNumber, number, progress, className } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const counterRef = useRef(undefined)

  return (
    <div>
      <Button
        disableElevation
        className={clsx(classes.root, className)}
        onClick={() => setIsPopoverOpen(true)}
        ref={counterRef}
      >
        {includeNumber && (
          <Typography className={classes.counter} variant="h5">
            {number}
          </Typography>
        )}
        <CircularProgress
          variant="determinate"
          value={progress === 0 ? 1 : progress}
        />
        <PetsIcon className={classes.petsIcon} />
      </Button>
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={counterRef.current}
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
            Your pawsitive impact!
          </Typography>
          <Typography
            variant="body2"
            className={classes.dropdownText}
            gutterBottom
          >
            This shows how many treats your tabs can provide to help shelter
            cats get adopted. Every tab you open helps. Keep it up!
          </Typography>
        </div>
      </DashboardPopover>
    </div>
  )
}

ImpactCounter.propTypes = {
  includeNumber: PropTypes.bool,
  number: PropTypes.number,
  progress: PropTypes.number.isRequired,
  className: PropTypes.string,
}

ImpactCounter.defaultProps = {
  includeNumber: false,
  number: 0,
  className: '',
}

export default ImpactCounter
