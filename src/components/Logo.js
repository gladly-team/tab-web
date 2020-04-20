/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import tabLogoDefault from 'src/assets/logos/logo.svg'
import tabLogoWhite from 'src/assets/logos/logo-white.svg'
import tabLogoGrey from 'src/assets/logos/logo-grey.svg'
import tabLogoWithText from 'src/assets/logos/logo-with-text.svg'

const Logo = props => {
  const { color, includeText, style, ...otherProps } = props
  let logo
  if (includeText) {
    logo = tabLogoWithText
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
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img style={{ height: 40, ...style }} src={logo} {...otherProps} />
}

Logo.propTypes = {
  includeText: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  color: PropTypes.oneOf(['default', 'purple', 'white', 'grey']),
}

Logo.defaultProps = {
  includeText: false,
  style: {},
  color: 'default',
}

export default Logo
