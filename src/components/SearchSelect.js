import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import CheckIcon from '@material-ui/icons/Check'
import Button from '@material-ui/core/Button'
import DashboardPopover from './DashboardPopover'

const useStyles = makeStyles((theme) => ({
  impactButtonText: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: '11px',
    paddingTop: theme.spacing(0),
  },
  searchToggleButton: {
    color: 'black',
    textTransform: 'unset',
    justifyContent: 'unset',
  },
  info: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#969696',
    borderTop: '1px solid #C4C4C4',
  },
  infoText: {
    fontSize: '12px',
    marginLeft: theme.spacing(1),
  },
  popoverContent: {
    width: theme.spacing(27.5),
  },
  selectedButton: {
    backgroundColor: 'white!important',
    color: 'black!important',
    border: '0px',
    '& svg': {
      color: 'black',
    },
    '& p': {
      fontWeight: '700',
    },
  },
  impactSubtitleText: {
    fontSize: '12px',
  },
  impactLinkText: {
    color: '#F71F6C',
    textDecoration: 'underline',
    fontWeight: '700',
  },
  linkTextWrapper: {
    fontSize: '12px',
    textAlign: 'left',
    paddingLeft: '43px',
  },
  popoverPaperClass: {
    borderRadius: '12px',
    marginTop: theme.spacing(1),
  },
  buttonRoot: {
    border: '0px',
  },
  checkIcon: {
    marginRight: theme.spacing(1),
    color: 'transparent',
  },
  moreInfoButton: {
    padding: '0px 0px',
  },
  moreInfoText: {
    justifyContent: 'flex-start',
    textTransform: 'unset',
  },
  toggleButtonGroup: {
    width: '100%',
  },
}))

const SearchSelect = ({
  anchorEl,
  onClose,
  userId,
  onMoreInfoClick,
  onSearchEngineSwitch,
  userSearchEngine,
  searchEngines,
  open,
}) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(open)
  const [currentSearchEngine, setCurrentSearchEngine] = useState(
    userSearchEngine.engineId
  )
  const setCurrentSearchEngineHandler = useCallback(
    async (_event, newSearchEngine) => {
      if (newSearchEngine !== null) {
        SetUserSearchEngineMutation(userId, newSearchEngine)
        setCurrentSearchEngine(newSearchEngine)
        onSearchEngineSwitch(newSearchEngine)
      }
    },
    [onSearchEngineSwitch, userId]
  )
  const onCloseHandler = useCallback(async () => {
    onClose()
  }, [onClose])

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const searchEnginesSorted = [...searchEngines.edges].sort(
    (a, b) => a.node.rank - b.node.rank
  )
  const searchEngineButtonComponents = searchEnginesSorted.map(
    (searchEngineNode) => (
      <ToggleButton
        key={searchEngineNode.node.engineId}
        classes={{
          root: classes.buttonRoot,
          selected: classes.selectedButton,
        }}
        className={classes.searchToggleButton}
        value={searchEngineNode.node.engineId}
      >
        <CheckIcon className={classes.checkIcon} />
        <Typography>{searchEngineNode.node.name}</Typography>
      </ToggleButton>
    )
  )
  const indexOfCharitableSearchEngine = searchEnginesSorted.findIndex(
    (engineNode) => engineNode.node.isCharitable
  )
  if (indexOfCharitableSearchEngine >= 0) {
    searchEngineButtonComponents.splice(
      indexOfCharitableSearchEngine + 1,
      0,
      <Button
        key="moreInfo"
        className={classes.impactButtonText}
        classes={{
          root: classes.moreInfoButton,
          text: classes.moreInfoText,
        }}
        variant="text"
        onClick={onMoreInfoClick}
      >
        <Typography className={classes.linkTextWrapper}>
          <span className={classes.impactLinkText}>Earn More Impact</span> ❤️
        </Typography>
      </Button>
    )
  }
  return (
    <DashboardPopover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onCloseHandler}
      popoverClasses={{ paper: classes.popoverPaperClass }}
    >
      <div className={classes.popoverContent}>
        <ToggleButtonGroup
          className={classes.toggleButtonGroup}
          orientation="vertical"
          value={currentSearchEngine}
          exclusive
          onChange={setCurrentSearchEngineHandler}
        >
          {searchEngineButtonComponents}
        </ToggleButtonGroup>
        <div className={classes.info}>
          <InfoIcon />
          <Typography className={classes.infoText}>
            Only updates search preferences for the new tab page, not your
            browser.
          </Typography>
        </div>
      </div>
    </DashboardPopover>
  )
}

SearchSelect.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
  onClose: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userSearchEngine: PropTypes.shape({
    engineId: PropTypes.string,
    searchUrl: PropTypes.string,
    inputPrompt: PropTypes.string,
  }).isRequired,
  onMoreInfoClick: PropTypes.func,
  onSearchEngineSwitch: PropTypes.func,
  searchEngines: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          engineId: PropTypes.string,
          name: PropTypes.string,
          searchUrl: PropTypes.string,
          rank: PropTypes.number,
          isCharitable: PropTypes.bool,
          inputPrompt: PropTypes.string,
        }),
      })
    ),
  }),
}

SearchSelect.defaultProps = {
  open: false,
  anchorEl: undefined,
  onClose: () => {},
  onMoreInfoClick: () => {},
  onSearchEngineSwitch: () => {},
  searchEngines: [],
}

export default SearchSelect
