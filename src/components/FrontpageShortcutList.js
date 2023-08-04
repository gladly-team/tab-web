import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AddCircleOutline } from '@mui/icons-material'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { KeyboardArrowDown } from '@material-ui/icons'
import UpdateWidgetDataMutation from 'src/utils/mutations/UpdateWidgetDataMutation'
import { WIDGET_TYPE_BOOKMARKS } from 'src/utils/constants'
import { v4 as uuid } from 'uuid'
import { Backdrop } from '@material-ui/core'
import ShortcutIcon from './ShortcutIcon'
import AddShortcut from './AddShortcut'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
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
  openButton: {
    color: 'white',
  },
  addShortcutModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  addShortcutWrapper: {
    width: '400px',
  },
}))
const FrontpageShortcutList = ({ openHandler, user }) => {
  const { widgets: { edges: widgetNodes = [] } = {} } = user
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarkWidget, setBookmarkWidget] = useState(null)

  useEffect(() => {
    setBookmarkWidget(
      widgetNodes.find(
        (widgetNode) => widgetNode.node.type === WIDGET_TYPE_BOOKMARKS
      )
    )
    const bookmarksData =
      bookmarkWidget && bookmarkWidget.node.data
        ? JSON.parse(bookmarkWidget.node.data).bookmarks || []
        : []
    setBookmarks(bookmarksData)
  }, [widgetNodes, bookmarkWidget])

  const [addShortcutWidgetOpen, setAddShortcutWidgetOpen] = useState(false)

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

  const [currentId, setCurrentId] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')

  const onShortcutEdit = (id, text, url) => {
    setCurrentId(id)
    setCurrentName(text)
    setCurrentUrl(url)
    setAddShortcutWidgetOpen(true)
  }

  const onNewShortcut = () => {
    setCurrentId(uuid())
    setCurrentName('')
    setCurrentUrl('')
    setAddShortcutWidgetOpen(true)
  }

  const shortcutWidgetCancel = () => {
    setAddShortcutWidgetOpen(false)
  }

  const classes = useStyles()
  const shortcutIcons = bookmarks
    .slice(-4)
    .map((bookmark) => (
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
    <div className={classes.wrapper}>
      <div className={classes.shortcutList}>
        {shortcutIcons}
        <Button
          className={classes.button}
          onClick={onNewShortcut}
          classes={{ label: classes.label }}
          data-test-id="add-shortcut"
        >
          <AddCircleOutline className={classes.addCircle} />
          <Typography className={classes.overflow}>Add Shortcut</Typography>
        </Button>
      </div>
      <IconButton onClick={openHandler} className={classes.openButton}>
        <KeyboardArrowDown />
      </IconButton>
      <Backdrop
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
      </Backdrop>
    </div>
  )
}
FrontpageShortcutList.propTypes = {
  user: PropTypes.shape({
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
  openHandler: PropTypes.func.isRequired,
}

export default FrontpageShortcutList
