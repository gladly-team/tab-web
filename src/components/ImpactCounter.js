import React, { useRef, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import DashboardPopover from 'src/components/DashboardPopover'
import Button from '@material-ui/core/Button'
import Markdown from 'src/components/Markdown'
import CauseIcon from 'src/components/CauseIcon'

const useStyles = makeStyles((theme) => ({
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
    height: '40px',
  },
  impactIcon: {
    position: 'relative',
    marginLeft: '-32px',
    marginRight: '8px',
  },
  counter: {
    marginRight: '14px',
    marginLeft: '14px',
  },
  popoverText: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    // Paragraph content has built-in bottom gutter.
    paddingBottom: theme.spacing(0),
    width: 230,
  },
  popover: { marginTop: 10 },
}))

const ImpactCounter = (props) => {
  const classes = useStyles()

  const {
    includeNumber,
    number,
    progress,
    className,
    disabled,
    icon,
    dropdownText,
    dropdownTextSquads,
    disableDropdown,
  } = props
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const counterRef = useRef(undefined)

  const dropdownMarkdown = !disabled ? dropdownText : dropdownTextSquads
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
        {icon ? <CauseIcon icon={icon} className={classes.impactIcon} /> : null}
      </Button>
      {!disableDropdown && (
        <DashboardPopover
          open={isPopoverOpen}
          anchorEl={counterRef.current}
          onClose={() => {
            setIsPopoverOpen(false)
          }}
          className={classes.popover}
        >
          <div className={classes.popoverText}>
            <Markdown>{dropdownMarkdown}</Markdown>
          </div>
        </DashboardPopover>
      )}
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

  /**
   * The Icon related to the cause
   */
  icon: PropTypes.string,

  /**
   * Text for the dropdown
   */
  dropdownText: PropTypes.string.isRequired,

  /**
   * Text for the dropdown when in a mission
   */
  dropdownTextSquads: PropTypes.string.isRequired,

  /**
   * disables the dropdown
   */
  disableDropdown: PropTypes.bool,
}

ImpactCounter.defaultProps = {
  includeNumber: false,
  disabled: false,
  number: 0,
  className: '',
  icon: 'paw',
  disableDropdown: false,
}

export default ImpactCounter
