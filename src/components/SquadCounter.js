import React, { useRef, useState } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import SquadIcon from 'src/assets/icons/SquadIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DashboardPopover from 'src/components/DashboardPopover'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    background: 'white',
    height: '40px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px grey',
    borderRadius: '30px',
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    padding: '0px',
    '&:hover': {
      background: 'white',
    },
  },
  squadsIcon: {
    position: 'relative',
    marginRight: theme.spacing(1.5),
    height: '20px',
    width: '20px',
  },
  progressBar: {
    marginLeft: theme.spacing(1.5),
    width: '30px',
  },
  popoverText: {
    padding: 12,
    width: 220,
  },
  popover: { marginTop: 10 },
}))

const SquadCounter = (props) => {
  const classes = useStyles()

  const { progress, className } = props
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
        <SquadIcon className={classes.squadsIcon} viewBox="0 0 20 20" />
        <Typography className={classes.counter} variant="h5">
          {Math.floor(progress)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          classes={{ root: classes.progressBar }}
        />
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
            style={{ fontWeight: 'bold' }}
            gutterBottom
          >
            Your pawsitive impact!
          </Typography>
          <Typography
            variant="body2"
            className={classes.dropdownText}
            gutterBottom
          >
            {`Your squad completed ${Math.round(
              progress
            )}% of the goal to give a cat a training session! This helps them get adopted more quickly.`}
          </Typography>
        </div>
      </DashboardPopover>
    </div>
  )
}

SquadCounter.propTypes = {
  /**
   The progress bar as a number between 0 and 100 
  */
  progress: PropTypes.number.isRequired,
  className: PropTypes.string,
}

SquadCounter.defaultProps = {
  className: '',
}

export default SquadCounter
