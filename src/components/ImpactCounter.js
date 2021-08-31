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

  const { includeNumber, number, progress, className, disabled } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const counterRef = useRef(undefined)

  return (
    <div onMouseEnter={disabled ? () => setIsPopoverOpen(true) : undefined}>
      <Button
        disabled={disabled}
        disableElevation
        className={clsx(classes.root, className)}
        ref={counterRef}
        onClick={() => setIsPopoverOpen(true)}
      >
        {includeNumber && (
          <Typography className={classes.counter} variant="h5">
            {number}
          </Typography>
        )}
        <CircularProgress
          color={disabled ? 'inherit' : 'primary'}
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
            style={{ fontWeight: 'bold' }}
          >
            {disabled ? 'Your treats are still here' : 'Your pawsitive impact!'}
          </Typography>
          <Typography
            variant="body2"
            className={classes.dropdownText}
            gutterBottom
          >
            {disabled
              ? 'Don’t worry, we’ve still got your treats! We just paused them while you and your squad complete your new mission.'
              : 'This shows how many treats your tabs can provide to help shelter cats get adopted. Every tab you open helps. Keep it up!'}
          </Typography>
        </div>
      </DashboardPopover>
    </div>
  )
}

ImpactCounter.propTypes = {
  /**
   Checks if the number of treats should be included
  */
  includeNumber: PropTypes.bool,

  /**
   whether impact counter is greyed out or not
  */
  disabled: PropTypes.bool,

  /**
   The amount of treats a person has earned
  */
  number: PropTypes.number,

  /**
   The progress to next treat as a number between 0 and 100 
  */
  progress: PropTypes.number.isRequired,
  className: PropTypes.string,
}

ImpactCounter.defaultProps = {
  includeNumber: false,
  disabled: false,
  number: 0,
  className: '',
}

export default ImpactCounter
