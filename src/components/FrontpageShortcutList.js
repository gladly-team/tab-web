import React from 'react'
import PropTypes from 'prop-types'
import { AddCircleOutline } from '@mui/icons-material'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ShortcutIcon from './ShortcutIcon'

const useStyles = makeStyles((theme) => ({
  button: {
    height: '150px',
    width: '110px',
    maxWidth: '110px',
    borderRadius: '10px',
    padding: theme.spacing(1),
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    textTransform: 'none',
  },
  shortcutList: {
    display: 'flex',
    flexDirection: 'row',
  },
  addCircle: {
    marginTop: '24px',
    width: '86px',
    height: '86px',
  },
  label: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
const FrontpageShortcutList = ({ bookmarks, addShortcutClick }) => {
  const classes = useStyles()
  const shortcutIcons = bookmarks
    .slice(-4)
    .map((bookmark) => (
      <ShortcutIcon
        key={bookmark.link}
        text={bookmark.name}
        url={bookmark.link}
      />
    ))
  return (
    <div className={classes.shortcutList}>
      {shortcutIcons}
      <Button
        className={classes.button}
        onClick={addShortcutClick}
        classes={{ label: classes.label }}
      >
        <AddCircleOutline className={classes.addCircle} />
        <Typography className={classes.overflow}>Add Shortcut</Typography>
      </Button>
    </div>
  )
}
FrontpageShortcutList.propTypes = {
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ),
  addShortcutClick: PropTypes.func.isRequired,
}
FrontpageShortcutList.defaultProps = {
  bookmarks: [],
}

export default FrontpageShortcutList
