import React from 'react'
import PropTypes from 'prop-types'
import PetsIcon from '@material-ui/icons/Pets'
import SvgIcon from '@material-ui/core/SvgIcon'
import { mdiJellyfish, mdiHandshake } from '@mdi/js'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
  STORAGE_BLACK_EQUITY_CAUSE_ID,
} from '../utils/constants'

const CauseIcon = ({ cause }) => {
  let icon
  switch (cause) {
    case STORAGE_SEAS_CAUSE_ID:
      icon = (
        <SvgIcon>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiJellyfish}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case STORAGE_CATS_CAUSE_ID:
      icon = <PetsIcon />
      break
    case STORAGE_BLACK_EQUITY_CAUSE_ID:
      icon = (
        <SvgIcon data-test-id="black-equity-icon">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiHandshake}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    default:
      icon = <PetsIcon />
      break
  }
  return icon
}
CauseIcon.displayName = 'CauseIcon'

CauseIcon.propTypes = {
  cause: PropTypes.string.isRequired,
}
export default CauseIcon
