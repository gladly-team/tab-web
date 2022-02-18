import React, { useCallback, useState } from 'react'
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
  yahooButtonText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: '11px',
    marginLeft: theme.spacing(4),
    paddingTop: theme.spacing(0),
  },
  searchToggleButton: {
    color: 'black',
    textTransform: 'unset',
    justifyContent: 'unset',
  },
  yahooSearchToggleButton: {
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
  },
  yahooSubtitleText: {
    fontSize: '12px',
  },
  yahooLinkText: {
    color: '#F71F6C',
    textDecoration: 'underline',
    fontWeight: '700',
  },
  linkTextWrapper: {
    fontSize: '12px',
    textAlign: 'left',
  },
  popoverPaperClass: {
    borderRadius: '12px',
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
}))

const SearchSelect = ({
  anchorEl,
  onClose,
  userId,
  onMoreInfoClick,
  userSearchEngine,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [currentSearchEngine, setCurrentSearchEngine] =
    useState(userSearchEngine)
  const setCurrentSearchEngineHandler = useCallback(
    async (_event, newSearchEngine) => {
      if (newSearchEngine !== null) {
        setCurrentSearchEngine(newSearchEngine)
        SetUserSearchEngineMutation(userId, newSearchEngine)
      }
    },
    [userId]
  )
  const onCloseHandler = useCallback(async () => {
    onClose()
    setOpen(false)
  }, [onClose])
  return (
    <DashboardPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onCloseHandler}
      popoverClasses={{ paper: classes.popoverPaperClass }}
    >
      <div className={classes.popoverContent}>
        <ToggleButtonGroup
          orientation="vertical"
          value={currentSearchEngine}
          exclusive
          onChange={setCurrentSearchEngineHandler}
        >
          <ToggleButton
            classes={{
              root: classes.buttonRoot,
              selected: classes.selectedButton,
            }}
            className={classes.yahooSearchToggleButton}
            value="Yahoo"
          >
            <CheckIcon className={classes.checkIcon} />
            <Typography>Yahoo</Typography>
          </ToggleButton>
          <div className={classes.yahooButtonText}>
            <Typography className={classes.yahooSubtitleText}>
              Earn impact and do more good with every search you make on the new
              tab page.
            </Typography>
            <Button
              classes={{
                root: classes.moreInfoButton,
                text: classes.moreInfoText,
              }}
              variant="text"
              onClick={onMoreInfoClick}
            >
              <Typography className={classes.linkTextWrapper}>
                <span className={classes.yahooLinkText}>Earn More Impact</span>{' '}
                ❤️
              </Typography>
            </Button>
          </div>
          <ToggleButton
            classes={{
              root: classes.buttonRoot,
              selected: classes.selectedButton,
            }}
            className={classes.searchToggleButton}
            value="Google"
          >
            <CheckIcon className={classes.checkIcon} />
            <Typography>Google</Typography>
          </ToggleButton>
          <ToggleButton
            classes={{
              root: classes.buttonRoot,
              selected: classes.selectedButton,
            }}
            className={classes.searchToggleButton}
            value="Bing"
          >
            <CheckIcon className={classes.checkIcon} />
            <Typography>Bing</Typography>
          </ToggleButton>
          <ToggleButton
            classes={{
              root: classes.buttonRoot,
              selected: classes.selectedButton,
            }}
            className={classes.searchToggleButton}
            value="DuckDuckGo"
          >
            <CheckIcon className={classes.checkIcon} />
            <Typography>DuckDuckGo</Typography>
          </ToggleButton>
          <ToggleButton
            classes={{
              root: classes.buttonRoot,
              selected: classes.selectedButton,
            }}
            className={classes.searchToggleButton}
            value="Ecosia"
          >
            <CheckIcon className={classes.checkIcon} />
            <Typography>Ecosia</Typography>
          </ToggleButton>
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
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
  onClose: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userSearchEngine: PropTypes.string.isRequired,
  onMoreInfoClick: PropTypes.func,
}

SearchSelect.defaultProps = {
  anchorEl: undefined,
  onClose: () => {},
  onMoreInfoClick: () => {},
}

export default SearchSelect
