/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// TODO: @jtan Adjust for Accessibility
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Link from 'src/components/Link'

const useStyles = makeStyles((theme) => ({
  button: {
    height: '150px',
    width: '110px',
    maxWidth: '110px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    padding: theme.spacing(1),
  },
  hover: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    width: '100%',
    justifyContent: 'space-between',
  },
  miniButton: {
    width: '24px',
    height: '24px',
    '&:hover': {
      color: 'white',
    },
  },
  letterIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '100%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  overflow: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: 'white',
  },
}))
const ShortcutIcon = ({ onEdit, onDelete, text, url, id }) => {
  const getFirstTwoLetters = (str) => {
    const words = str.split(' ')
    const firstLetters = words.map((word) => word.charAt(0))
    return firstLetters.slice(0, 2).join('')
  }
  const [hover, setHover] = useState(false)
  const classes = useStyles()
  const firstLettersText = getFirstTwoLetters(text)
  const onDeleteHandler = (event) => {
    onDelete(id)
    event.preventDefault()
  }
  const onEditHandler = (event) => {
    onEdit(id, text, url)
    event.preventDefault()
  }
  return (
    <Link to={url} target="_blank" externalLink>
      <div
        className={hover ? clsx(classes.button, classes.hover) : classes.button}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <Fade in={hover}>
          <div className={classes.buttons}>
            <IconButton
              className={classes.miniButton}
              onClick={onDeleteHandler}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton className={classes.miniButton} onClick={onEditHandler}>
              <EditIcon />
            </IconButton>
          </div>
        </Fade>
        <div className={classes.letterIcon}>
          <Typography variant="h6">{firstLettersText}</Typography>
        </div>
        <Typography className={classes.overflow}>{text}</Typography>
      </div>
    </Link>
  )
}

ShortcutIcon.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

ShortcutIcon.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
}

export default ShortcutIcon
