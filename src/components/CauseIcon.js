import React from 'react'
import PropTypes from 'prop-types'
import PetsIcon from '@material-ui/icons/Pets'
import SvgIcon from '@material-ui/core/SvgIcon'
import { mdiJellyfish } from '@mdi/js'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
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
