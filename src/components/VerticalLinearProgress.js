import { LinearProgress, Typography } from '@material-ui/core'

import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Stars } from '@mui/icons-material'

const useStyles = makeStyles(() => ({
  linearProgressRoot: {
    borderRadius: ({ borderRadius }) => borderRadius,
    width: ({ width }) => width,
    height: '100%',
  },
  linearProgressBar: {
    borderRadius: ({ borderRadius }) => borderRadius,
    transform: ({ progress }) => `translateY(${100 - progress}%) !important`,
  },
  wrapper: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  markers: {
    position: 'absolute',
    width: ({ width }) => width / 2,
    left: ({ width }) => width / 4,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberMarker: {
    backgroundColor: 'white',
    fontSize: '12px',
    width: '34px',
    height: '34px',
    borderRadius: '34px',
    paddingTop: '8px',
    paddingLeft: '5px',
    fontWeight: '700',
  },
  completedMarker: {
    marginTop: '8px',
    borderRadius: '15px',
    backgroundColor: 'white',
    width: '34px',
    height: '34px',
    paddingLeft: '5px',
    paddingTop: '5px',
  },
  dummyDiv: {
    height: '34px',
  },
  innerBar: {
    borderRadius: ({ borderRadius }) =>
      `0px 0px ${borderRadius}px ${borderRadius}px !important`,
  },
}))

const VerticalLinearProgress = ({
  progress,
  showMarkers,
  borderRadius,
  width,
}) => {
  const classes = useStyles({
    borderRadius,
    width,
    progress,
  })
  return (
    <div className={classes.wrapper}>
      <LinearProgress
        color="primary"
        classes={{
          root: classes.linearProgressRoot,
          bar: classes.linearProgressBar,
          bar1Determinate: classes.innerBar,
        }}
        variant="determinate"
        value={progress}
      />
      {showMarkers && (
        <div className={classes.markers}>
          <div className={classes.completedMarker}>
            <Stars color="primary" />
          </div>
          <Typography className={classes.numberMarker}>75%</Typography>
          <Typography className={classes.numberMarker}>50%</Typography>
          <Typography className={classes.numberMarker}>25%</Typography>
          <div className={classes.dummyDiv} />
        </div>
      )}
    </div>
  )
}

VerticalLinearProgress.displayName = 'VerticalLinearProgress'
VerticalLinearProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  showMarkers: PropTypes.bool,
  borderRadius: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
}

VerticalLinearProgress.defaultProps = {
  showMarkers: false,
}

export default VerticalLinearProgress
