import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { windowOpenTop } from 'src/utils/navigation'

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
  const { className } = props
  const classes = useStyles()
  const searchInputRef = React.createRef()

  const onSearch = () => {
    const query = searchInputRef.current.value
    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`
    windowOpenTop(searchURL)
  }

  return (
    <div className={className}>
      <Input
        type="text"
        inputRef={searchInputRef}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch()
          }
        }}
        placeholder="Search Google"
        disableUnderline
        fullWidth
        classes={{
          root: classes.inputRootStyle,
          input: classes.inputStyle,
          focused: classes.inputRootFocused,
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="Search button" onClick={onSearch}>
              <SearchIcon style={{ color: searchBoxBorderColorFocused }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
SearchInput.propTypes = {
  className: PropTypes.string,
}
SearchInput.defaultProps = {
  className: '',
}

export default SearchInput
