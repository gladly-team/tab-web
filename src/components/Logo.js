/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import tabLogoDefault from 'src/assets/logos/logo.svg'
import tabLogoWhite from 'src/assets/logos/logo-white.svg'
import tabLogoGrey from 'src/assets/logos/logo-grey.svg'
import tabLogoWithText from 'src/assets/logos/logo-with-text.svg'
import tabLogoWithTextWhite from 'src/assets/logos/logo-with-text-white.svg'

const useStyles = makeStyles(() => ({
  logoDefaults: {
    height: 40,
    boxSizing: 'content-box',
  },
}))

const Logo = (props) => {
  const { className, color, includeText, style, ...otherProps } = props
  const classes = useStyles()
  let logo
  if (includeText) {
    switch (color) {
      case 'white': {
        logo = tabLogoWithTextWhite
        break
      }
      default: {
        logo = tabLogoWithText
        break
      }
    }
  } else {
    switch (color) {
      case 'default': {
        logo = tabLogoDefault
        break
      }
      case 'purple': {
        logo = tabLogoDefault
        break
      }
      case 'white': {
        logo = tabLogoWhite
        break
      }
      case 'grey': {
        logo = tabLogoGrey
        break
      }
      default: {
        throw new Error(`No "tab" logo exists with color "${color}".`)
      }
    }
  }

  // The alt text flashes on Firefox.
  // Note we need to manually add the basePath to assets:
  // https://github.com/vercel/next.js/issues/4998#issuecomment-657233398
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      style={style}
      className={clsx(classes.logo, className)}
      src={logo}
      {...otherProps}
    />
  )
}

Logo.displayName = 'Logo'

Logo.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['default', 'purple', 'white', 'grey']),
  includeText: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

Logo.defaultProps = {
  className: '',
  color: 'default',
  includeText: false,
  style: {},
}

export default Logo
