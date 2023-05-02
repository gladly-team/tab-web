import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Backdrop, Typography } from '@material-ui/core'
import shortcutImage from 'src/assets/images/shortcut.png'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SearchInput from 'src/components/SearchInput'
import Alert from '@material-ui/lab/Alert'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import Logo from 'src/components/Logo'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { goTo } from 'src/utils/navigation'
import { accountURL } from 'src/utils/urls'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    height: '100%',
    width: '100%',
  },
  shortcut: {
    width: '300px',
  },
  addIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    height: '48px',
    width: '48px',
  },
  white: {
    color: 'white',
    borderColor: 'white',
  },
  topBar: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    color: 'white',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  topContent: {
    width: '100%',
  },
  backdrop: {
    width: '100vw',
  },
  buttonRoot: {
    padding: '0px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))
const AddShortcutPage = ({ app, user, userId, closeHandler }) => {
  const classes = useStyles()
  const onSettingsClick = () => {
    goTo(accountURL)
  }

  return (
    <Backdrop open className={classes.backdrop}>
      <div className={classes.content}>
        <div className={classes.topContent}>
          <div className={classes.topBar}>
            <Logo style={{ height: 40 }} color="white" />
            <SearchInput app={app} user={user} userId={userId} />
            <IconButton onClick={closeHandler} className={classes.closeButton}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.addIcon}>
            <AddCircleOutlineIcon className={classes.circle} />
            <Typography>Add Shortcut</Typography>
          </div>
        </div>
        <div className={classes.center}>
          <img
            src={shortcutImage}
            alt="shortcut"
            className={classes.shortcut}
          />
          <Typography className={classes.shortcutText}>
            Add more shortcuts and they’ll appear here!
          </Typography>
          <Alert
            icon={<InfoIcon className={classes.white} />}
            severity="info"
            variant="outlined"
            className={classes.white}
          >
            Don't want shortcuts? You can hide them from your settings page.
            <Button
              classes={{
                root: classes.buttonRoot,
              }}
              className={classes.white}
              onClick={onSettingsClick}
            >
              Settings
            </Button>
          </Alert>
        </div>
        <IconButton onClick={closeHandler} className={classes.closeButton}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </div>
    </Backdrop>
  )
}

AddShortcutPage.propTypes = {
  userId: PropTypes.string.isRequired,
  app: PropTypes.shape({
    searchEngines: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            engineId: PropTypes.string,
            name: PropTypes.string,
            rank: PropTypes.number,
            isCharitable: PropTypes.bool,
            inputPrompt: PropTypes.string,
          }),
        })
      ),
    }),
  }).isRequired,
  user: PropTypes.shape({
    searchEngine: PropTypes.shape({
      engineId: PropTypes.string,
      inputPrompt: PropTypes.string,
      searchUrlPersonalized: PropTypes.string,
    }),
    yahooPaidSearchRewardOptIn: PropTypes.bool,
  }).isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default AddShortcutPage
