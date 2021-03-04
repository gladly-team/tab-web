import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import PetsIcon from '@material-ui/icons/Pets'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px grey',
    borderRadius: '30px',
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
}))

const ImpactCounter = (props) => {
  const classes = useStyles()

  const { includeNumber, number, progress, className } = props

  return (
    <div className={clsx(classes.root, className)}>
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
