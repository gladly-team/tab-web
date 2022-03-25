import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { windowOpenTop } from 'src/utils/navigation'
import LogSearchMutation from 'src/utils/mutations/LogSearchMutation'
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
}))

const SearchInput = (props) => {
  const { className, userId, app, user } = props
  const { searchEngine } = user
  const { searchEngines } = app
  const [searchSelectOpen, setSearchSelectOpen] = useState(false)
  const classes = useStyles()
  const searchInputRef = React.createRef()
  const fullInputRef = React.createRef()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [currentSearchEngine, setCurrentSearchEngine] = useState(searchEngine)

  const onSearch = () => {
    const query = searchInputRef.current.value
    const searchURL = currentSearchEngine.searchUrl.replace(
      /{\w+}/,
      encodeURIComponent(query)
    )
    LogSearchMutation({
      userId,
      source: 'tab',
    })
    windowOpenTop(searchURL)
  }

  const onSwitchSearchEngine = (newSearchEngineId) => {
    const newSearchEngine = searchEngines.edges.find(
      (engine) => engine.node.engineId === newSearchEngineId
    ).node
    setCurrentSearchEngine(newSearchEngine)
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
              <IconButton
                aria-label="Search select"
                onClick={onSearchSelectOpen}
              >
                <ArrowDropDownIcon />
              </IconButton>
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
      />
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
SearchInput.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string.isRequired,
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
  }).isRequired,
}
SearchInput.defaultProps = {
  className: '',
}

export default SearchInput
