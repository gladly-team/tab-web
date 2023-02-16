import { LinearProgress, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Stars } from '@mui/icons-material'

const useAnimationStyles = ({ endProgress, borderRadius, width }) => {
  const classes = makeStyles((theme) => ({
    linearProgressRoot: {
      borderRadius,
      width,
      transition: 'width .3s',
      height: '100%',
    },

    linearProgressBar: {
      borderRadius,
      transform: `translateY(${100 - endProgress}%) !important`,
    },
    linearProgress: {
      gridRowStart: 1,
      gridColumnStart: 1,
    },
    wrapper: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      position: 'static',
      height: '100%',
    },
    markers: {
      width,
      zIndex: 20,
      gridRowStart: 1,
      gridColumnStart: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 'inherit',
    },
    numberMarker: {
      backgroundColor: 'white',
      fontSize: '14px',
      width: '42px',
      height: '42px',
      borderRadius: '42px',
      paddingTop: '10px',
      paddingLeft: '7px',
      fontWeight: '700',
    },
    completedMarker: {
      marginTop: '8px',
      borderRadius: '15px',
      backgroundColor: 'white',
      width: '42px',
      height: '42px',
      paddingLeft: '6px',
      paddingTop: '6px',
    },
    dummyDiv: {
      height: '42px',
    },
    innerBar: {
      borderRadius: `0px 0px ${borderRadius}px ${borderRadius}px !important`,
    },
    star: {
      color: theme.palette.primary.main,
      width: '30px',
      height: '30px',
    },
  }))
  return classes()
}

const VerticalLinearProgress = ({
  progress,
  showMarkers,
  borderRadius,
  width,
  startingProgress,
}) => {
  const [endProgress, setEndProgress] = useState(startingProgress || progress)

  useEffect(() => {
    setEndProgress(progress)
  }, [progress])

  // Workaround for MUI v4 animation bug:
  // https://github.com/mui/material-ui/issues/21011
  // https://stackoverflow.com/a/69629316/1332513
  const classes = useAnimationStyles({
    endProgress,
    borderRadius,
    width,
  })
  return (
    <div className={classes.wrapper}>
      <LinearProgress
        className={classes.linearProgress}
        classes={{
          root: classes.linearProgressRoot,
          bar: classes.linearProgressBar,
          bar1Determinate: classes.innerBar,
        }}
        variant="determinate"
        value={endProgress}
      />
      {showMarkers && (
        <div className={classes.markers}>
          <div className={classes.completedMarker}>
            <Stars className={classes.star} />
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
  startingProgress: PropTypes.number,
}

VerticalLinearProgress.defaultProps = {
  showMarkers: false,
  startingProgress: null,
}

export default VerticalLinearProgress
