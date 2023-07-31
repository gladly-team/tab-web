import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Backdrop, Modal, Typography } from '@material-ui/core'
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
import UpdateWidgetDataMutation from 'src/utils/mutations/UpdateWidgetDataMutation'
import { nanoid } from 'nanoid'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
import AddShortcut from './AddShortcut'
import ShortcutIcon from './ShortcutIcon'

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
    margin: 'auto',
    height: '150px',
    width: '120px',
    borderRadius: '10px',
    color: 'white',
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
  shortcutWrapper: {
    maxWidth: '600px',
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: theme.spacing(6),
  },
  shortcutIcons: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addShortcutModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addShortcutWrapper: {
    width: '400px',
  },
  label: {
    flexDirection: 'column',
  },
}))
const AddShortcutPage = ({ app, user, userId, closeHandler }) => {
  const { widgets: { edges: widgetNodes = [] } = {} } = user
  const bookmarkWidget = widgetNodes.find(
    (widgetNode) => widgetNode.node.type === WIDGET_TYPE_BOOKMARKS
  )
  const bookmarksData =
    bookmarkWidget && bookmarkWidget.node.data
      ? JSON.parse(bookmarkWidget.node.data).bookmarks || []
      : []
  const [addShortcutWidgetOpen, setAddShortcutWidgetOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState(bookmarksData)
  const shortcutWidgetCancel = () => {
    setAddShortcutWidgetOpen(false)
  }
  const saveBookmark = async (id, name, link) => {
    const existingIndex = bookmarks.findIndex((bookmark) => bookmark.id === id)
    let newBookmarks
    if (existingIndex === -1) {
      newBookmarks = [
        ...bookmarks,
        {
          id,
          name,
          link,
        },
      ]
    } else {
      newBookmarks = [...bookmarks]
      newBookmarks[existingIndex] = {
        id,
        name,
        link,
      }
    }
    setBookmarks(newBookmarks)
    setAddShortcutWidgetOpen(false)
    await UpdateWidgetDataMutation(
      user,
      bookmarkWidget.node,
      JSON.stringify({ bookmarks: newBookmarks })
    )
  }

  const deleteBookmark = async (id) => {
    const newBookmarks = bookmarks.filter((b) => b.id !== id)
    setBookmarks(newBookmarks)
    await UpdateWidgetDataMutation(
      user,
      bookmarkWidget.node,
      JSON.stringify({ bookmarks: newBookmarks })
    )
  }

  const classes = useStyles()
  const onSettingsClick = () => {
    goTo(accountURL)
  }

  const [currentId, setCurrentId] = useState(null)
  const [currentName, setCurrentName] = useState(null)
  const [currentUrl, setCurrentUrl] = useState(null)

  const onShortcutEdit = (id, text, url) => {
    setCurrentId(id)
    setCurrentName(text)
    setCurrentUrl(url)
    setAddShortcutWidgetOpen(true)
  }

  const onNewShortcut = () => {
    setCurrentId(nanoid(6))
    setCurrentName('')
    setCurrentUrl('')
    setAddShortcutWidgetOpen(true)
  }

  const shortcutIcons = bookmarks.map((bookmark) => (
    <ShortcutIcon
      key={bookmark.id}
      text={bookmark.name}
      url={bookmark.link}
      id={bookmark.id}
      onEdit={onShortcutEdit}
      onDelete={deleteBookmark}
    />
  ))

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
          <IconButton
            classes={{ label: classes.label }}
            className={classes.addIcon}
            onClick={onNewShortcut}
            data-test-id="add-shortcut"
          >
            <AddCircleOutlineIcon className={classes.circle} />
            <Typography>Add Shortcut</Typography>
          </IconButton>
        </div>
        <div className={classes.center}>
          {bookmarks.length > 0 ? (
            <div className={classes.shortcutWrapper}>
              <div className={classes.shortcutIcons}>{shortcutIcons}</div>
            </div>
          ) : (
            <div>
              <img
                src={shortcutImage}
                alt="shortcut"
                className={classes.shortcut}
              />
              <Typography className={classes.shortcutText}>
                Add more shortcuts and they’ll appear here!
              </Typography>
            </div>
          )}

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
      <Modal
        open={addShortcutWidgetOpen}
        className={classes.addShortcutModal}
        data-test-id="add-shortcut-modal"
      >
        <div className={classes.addShortcutWrapper}>
          <AddShortcut
            onCancel={shortcutWidgetCancel}
            onSave={saveBookmark}
            existingId={currentId}
            existingName={currentName}
            existingUrl={currentUrl}
          />
        </div>
      </Modal>
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
    widgets: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          data: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }).isRequired,
    yahooPaidSearchRewardOptIn: PropTypes.bool,
  }).isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default AddShortcutPage
