import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { addProtocolToURLIfNeeded } from 'src/utils/urls'
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

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
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
  const [nameError, setNameError] = useState(null)
  const [urlError, setUrlError] = useState(null)
  useEffect(() => setName(existingName), [existingName])
  useEffect(() => setUrl(existingUrl), [existingUrl])
  const classes = useStyles()
  const onCancelClick = () => {
    setName(existingName)
    setUrl(existingUrl)
    onCancel()
  }
  const validateName = (newName) => {
    let newNameError
    if (newName.length === 0) {
      newNameError = 'Shortcut name cannot be empty.'
    } else {
      newNameError = null
    }
    setNameError(newNameError)
    return newNameError
  }
  const validateUrl = (newUrl) => {
    let newUrlError
    if (newUrl.length === 0) {
      newUrlError = 'URL cannot be empty.'
    } else if (!isValidUrl(addProtocolToURLIfNeeded(newUrl))) {
      newUrlError = 'URL is not valid.'
    } else {
      newUrlError = null
    }
    setUrlError(newUrlError)
    return newUrlError
  }
  const validateForm = () => {
    const newNameError = validateName(name)
    const newUrlError = validateUrl(url)
    return newNameError || newUrlError
  }
  const onSaveClick = () => {
    const newUrl = addProtocolToURLIfNeeded(url)
    if (validateForm()) {
      return
    }
    onSave(existingId, name, newUrl)
    setName(name)
    setUrl(newUrl)
  }
  const changeName = (e) => {
    setName(e.target.value)
    validateName(e.target.value)
  }
  const changeUrl = (e) => {
    setUrl(e.target.value)
    validateUrl(e.target.value)
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
            {existingName === '' && existingUrl === '' ? 'Add' : 'Edit'}{' '}
            Shortcut
          </Typography>
          <hr />
          <div className={classes.urlFields}>
            <TextField
              required
              variant="outlined"
              label="Name"
              value={name}
              onChange={changeName}
              error={!!nameError}
              helperText={nameError}
              className={classes.textField}
            />
            <TextField
              required
              variant="outlined"
              label="URL"
              value={url}
              onChange={changeUrl}
              error={!!urlError}
              helperText={urlError}
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
            disabled={!!(nameError || urlError)}
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
