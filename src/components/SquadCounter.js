import React, { useRef, useState } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { SvgIcon } from '@material-ui/core'
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
    padding: '0px',
    '&:hover': {
      background: 'white',
    },
  },
  squadsIcon: {
    position: 'relative',
    marginLeft: theme.spacing(2),
    marginRight: '8px',
  },
  progressBar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
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
        <SvgIcon className={classes.squadsIcon} viewBox="0 0 22 22">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.68159 3.97963C7.34828 1.97969 8.62866 1.01348 10.3491 0.564681C13.4016 -0.231626 13.9399 1.81402 14.2728 3.07948L14.2758 3.09065C14.6387 4.46983 13.9529 5.1946 13.5979 5.56973C13.2943 5.89051 13.2327 5.95561 14.2758 5.95561C16.0861 5.95561 17.9103 19.1764 16.6052 19.7629C15.3001 20.3493 6.01885 20.4707 5.09125 19.7629C4.16365 19.055 5.35747 6.62115 6.88823 5.95561C7.36904 5.74656 7.66718 5.72053 7.83706 5.70569C7.93016 5.69757 7.98474 5.6928 8.00975 5.66312C8.04518 5.62107 8.02126 5.52901 7.96346 5.30651C7.8995 5.06029 7.79404 4.65432 7.68159 3.97963ZM17.7391 2.97608C15.5412 2.59766 15.5541 3.90433 15.5633 4.82778C15.5653 5.03285 15.5671 5.21903 15.5445 5.36365C17.7017 7.52697 18.2083 15.804 18.2048 18.2227C18.9332 18.2484 20.0015 18.2227 20.3104 17.9138C20.6965 17.5277 20.156 8.99166 19.9243 8.21945C19.8091 7.83538 18.9542 7.51451 18.2799 7.26144C17.5985 7.00568 17.1015 6.81917 17.7391 6.70666C19.0075 6.48282 20.0185 3.36853 17.7391 2.97608ZM4.87127 6.63012C4.38293 7.60683 3.12632 14.8865 3.30073 18.4794H1.20883C1.15069 18.5724 1.02046 18.4096 0.964649 17.0143C0.894885 15.2702 1.45301 8.5134 2.18554 7.85063C2.39108 7.66466 2.65705 7.50616 2.90021 7.36124C3.52363 6.98971 3.99713 6.70753 2.91806 6.28092C1.41812 5.68792 2.39483 3.42056 4.34825 3.21127C6.30166 3.00198 6.85394 4.73366 6.40339 5.50729C6.37575 5.52105 6.33821 5.53851 6.29295 5.55956C5.94433 5.72171 5.13793 6.09679 4.87127 6.63012Z"
            fill="primary"
          />
        </SvgIcon>
        <Typography className={classes.counter} variant="h5">
          {Math.round(progress)}%
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
