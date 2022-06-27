import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { windowOpenTop } from 'src/utils/navigation'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import { Typography } from '@material-ui/core'
import SearchSelect from './SearchSelect'

const searchBoxBorderColor = '#ced4da'
const searchBoxBorderColorFocused = '#bdbdbd'
const useStyles = makeStyles((theme) => ({
  inputRootStyle: {
    padding: 0,
    borderRadius: 28,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${searchBoxBorderColor}`,
    fontSize: 16,
    boxShadow: '0rem 0rem 0.02rem 0.02rem rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: searchBoxBorderColorFocused,
      boxShadow: '0rem 0.05rem 0.2rem 0.05rem rgba(0, 0, 0, 0.1)',
    },
  },
  inputRootFocused: {
    borderColor: searchBoxBorderColorFocused,
    boxShadow: '0rem 0.05rem 0.2rem 0.05rem rgba(0, 0, 0, 0.1)',
  },
  inputStyle: {
    padding: '12px 16px',
  },
  popper: {
    zIndex: '100000 !important',
  },
  tooltip: {
    maxWidth: 'unset',
    pointerEvents: 'auto',
    backgroundColor: theme.palette.primary.main,
  },
  arrow: {
    '&::before': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  tooltipCloseButton: {
    padding: theme.spacing(0),
    paddingLeft: theme.spacing(0.5),
    height: theme.spacing(1),
    '& svg': {
      height: theme.spacing(2),
      width: theme.spacing(2),
      color: 'white',
    },
  },
}))

const SearchInput = (props) => {
  const {
    className,
    userId,
    app,
    user,
    tooltip,
    onSearchSelectMoreInfoClick,
    onSearchInputClick,
  } = props
  const { searchEngine, yahooPaidSearchRewardOptIn } = user
  const { searchEngines } = app
  const [searchSelectOpen, setSearchSelectOpen] = useState(false)
  const classes = useStyles()
  const searchInputRef = React.createRef()
  const fullInputRef = React.createRef()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [currentSearchEngine, setCurrentSearchEngine] = useState(searchEngine)
  const [tooltipOpen, setTooltipOpen] = useState(!!tooltip)

  const getSearchEngine = useCallback(
    (searchEngineId) =>
      searchEngines.edges.find(
        (engine) => engine.node.engineId === searchEngineId
      ).node,
    [searchEngines]
  )

  useEffect(() => {
    setCurrentSearchEngine(searchEngine)
    setTooltipOpen(!!tooltip)
  }, [searchEngine, getSearchEngine, yahooPaidSearchRewardOptIn, tooltip])

  const onSearch = useCallback(async () => {
    const query = searchInputRef.current.value
    const searchURL = currentSearchEngine.searchUrl.replace(
      /{\w+}/,
      encodeURIComponent(query)
    )

    windowOpenTop(searchURL)
  }, [userId, currentSearchEngine.searchUrl, searchInputRef])

  const onSwitchSearchEngine = (newSearchEngineId) => {
    setCurrentSearchEngine(getSearchEngine(newSearchEngineId))
  }

  const onSearchSelectOpen = () => {
    setSearchSelectOpen(true)
    setAnchorEl(fullInputRef.current)
  }

  const onSearchSelectClose = () => {
    setSearchSelectOpen(false)
  }

  return (
    <div className={className}>
      <Input
        type="text"
        ref={fullInputRef}
        inputRef={searchInputRef}
        onFocus={() => onSearchInputClick()}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch()
          }
        }}
        placeholder={currentSearchEngine.inputPrompt}
        disableUnderline
        fullWidth
        classes={{
          root: classes.inputRootStyle,
          input: classes.inputStyle,
          focused: classes.inputRootFocused,
        }}
        endAdornment={
          <InputAdornment position="end">
            <div>
              <IconButton aria-label="Search button" onClick={onSearch}>
                <SearchIcon style={{ color: searchBoxBorderColorFocused }} />
              </IconButton>
              <Tooltip
                classes={{
                  arrow: classes.arrow,
                  tooltip: classes.tooltip,
                  popper: classes.popper,
                }}
                placement="top"
                open={tooltipOpen}
                arrow
                title={
                  <Typography variant="body2">
                    {tooltip}
                    <IconButton
                      className={classes.tooltipCloseButton}
                      onClick={() => {
                        setTooltipOpen(false)
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Typography>
                }
              >
                <IconButton
                  aria-label="Search select"
                  onClick={onSearchSelectOpen}
                >
                  <ArrowDropDownIcon />
                </IconButton>
              </Tooltip>
            </div>
          </InputAdornment>
        }
      />
      <SearchSelect
        userSearchEngine={searchEngine}
        anchorEl={anchorEl}
        userId={userId}
        searchEngines={searchEngines}
        open={searchSelectOpen}
        onClose={onSearchSelectClose}
        onSearchEngineSwitch={onSwitchSearchEngine}
        yahooPaidSearchRewardOptIn={yahooPaidSearchRewardOptIn}
        onMoreInfoClick={onSearchSelectMoreInfoClick}
      />
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
SearchInput.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string.isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  app: PropTypes.shape({
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
  }).isRequired,
  user: PropTypes.shape({
    searchEngine: PropTypes.shape({
      engineId: PropTypes.string,
      inputPrompt: PropTypes.string,
      searchUrl: PropTypes.string,
    }),
    yahooPaidSearchRewardOptIn: PropTypes.bool,
  }).isRequired,
  onSearchSelectMoreInfoClick: PropTypes.func,
  onSearchInputClick: PropTypes.func,
}
SearchInput.defaultProps = {
  className: '',
  tooltip: false,
  onSearchSelectMoreInfoClick: () => {},
  onSearchInputClick: () => {},
}

export default SearchInput
