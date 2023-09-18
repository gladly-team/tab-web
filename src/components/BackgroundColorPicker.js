import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { SketchPicker } from 'react-color'
import { Typography } from '@material-ui/core'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  gridList: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  previewContainer: {
    marginTop: 0,
    margin: theme.spacing(2),
    width: '100%',
    height: '60%',
  },
  header: {
    paddingLeft: 0,
  },
  divider: {
    marginBottom: 10,
  },
}))
const BackgroundColorPicker = ({ user, onBackgroundColorSelection }) => {
  const classes = useStyles()
  const [selectedColor, setSelectedColor] = useState(
    user.backgroundColor || '#000'
  )

  const onColorChanged = useCallback(
    (color) => {
      setSelectedColor(color.hex)
      onBackgroundColorSelection(color.hex)
    },
    [onBackgroundColorSelection]
  )

  return (
    <div className={classes.root}>
      <Typography>Select your color</Typography>
      <div className={classes.gridList}>
        <SketchPicker
          color={selectedColor}
          disableAlpha
          onChangeComplete={onColorChanged}
        />
        <div
          className={classes.previewContainer}
          style={{
            backgroundColor: selectedColor,
          }}
        />
      </div>
    </div>
  )
}

BackgroundColorPicker.propTypes = {
  user: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
  }).isRequired,
  onBackgroundColorSelection: PropTypes.func.isRequired,
}

export default BackgroundColorPicker
