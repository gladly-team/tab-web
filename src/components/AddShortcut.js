/* eslint no-useless-escape: 0 */

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Notification from './Notification'

const useStyles = makeStyles((theme) => ({
  noButton: {
    fontWeight: '500',
  },
  yesButton: {
    fontWeight: '900',
    marginLeft: theme.spacing(1),
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
  },
  text: {
    paddingBottom: theme.spacing(2),
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  urlFields: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

const addProtocolToURLIfNeeded = (url) => {
  const hasProtocol = (s) => {
    const regexp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s)
  }

  if (!hasProtocol(url)) {
    return `http://${url}`
  }
  return url
}

const AddShortcut = ({
  onCancel,
  onSave,
  existingName,
  existingUrl,
  existingId,
}) => {
  const [name, setName] = useState(existingName)
  const [url, setUrl] = useState(existingUrl)
  const classes = useStyles()
  const onCancelClick = () => {
    setName('')
    setUrl('')
    onCancel()
  }
  const onSaveClick = () => {
    onSave(existingId, name, addProtocolToURLIfNeeded(url))
    setName('')
    setUrl('')
  }
  const changeName = (e) => {
    setName(e.target.value)
  }
  const changeUrl = (e) => {
    setUrl(e.target.value)
  }
  return (
    <Notification
      text={
        <span className={classes.text}>
          <Typography
            variant="h1"
            className={classes.title}
            gutterBottom
            color="primary"
          >
            Add Shortcut
          </Typography>
          <hr />
          <div className={classes.urlFields}>
            <TextField
              required
              variant="outlined"
              label="Name"
              value={name}
              onChange={changeName}
              className={classes.textField}
            />
            <TextField
              required
              variant="outlined"
              label="URL"
              value={url}
              onChange={changeUrl}
              className={classes.textField}
            />
          </div>
        </span>
      }
      buttons={
        <div className={classes.buttonsWrapper}>
          <Button
            onClick={onCancelClick}
            className={classes.noButton}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveClick}
            className={classes.yesButton}
            variant="contained"
            disableElevation
          >
            Save
          </Button>
        </div>
      }
    />
  )
}

AddShortcut.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  existingName: PropTypes.string,
  existingUrl: PropTypes.string,
  existingId: PropTypes.string,
}

AddShortcut.defaultProps = {
  onCancel: () => {},
  onSave: () => {},
  existingName: '',
  existingUrl: '',
  existingId: null,
}

export default AddShortcut
