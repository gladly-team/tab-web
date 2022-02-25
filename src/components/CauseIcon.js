import React from 'react'
import PropTypes from 'prop-types'
import PetsIcon from '@material-ui/icons/Pets'
import SvgIcon from '@material-ui/core/SvgIcon'
import {
  mdiJellyfish,
  mdiHandshake,
  mdiPineTree,
  mdiMedicalBag,
  mdiFoodApple,
  mdiWater,
} from '@mdi/js'

const PAW = 'paw'
const JELLYFISH = 'jellyfish'
const HANDSHAKE = 'handshake'
const PINE_TREE = 'pine-tree'
const MEDICAL_BAG = 'medical-bag'
const FOOD_APPLE = 'food-apple'
const WATER = 'water'

const iconOptions = [
  PAW,
  JELLYFISH,
  HANDSHAKE,
  PINE_TREE,
  MEDICAL_BAG,
  FOOD_APPLE,
  WATER,
]

const CauseIcon = ({ icon, className }) => {
  let iconComp
  switch (icon) {
    case PAW:
      iconComp = <PetsIcon className={className} />
      break
    case JELLYFISH:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiJellyfish}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case HANDSHAKE:
      iconComp = (
        <SvgIcon data-test-id="black-equity-icon" className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiHandshake}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case PINE_TREE:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiPineTree}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case MEDICAL_BAG:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiMedicalBag}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case FOOD_APPLE:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiFoodApple}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case WATER:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiWater}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    default:
      iconComp = <PetsIcon className={className} />
      break
  }
  return iconComp
}

CauseIcon.displayName = 'CauseIcon'

CauseIcon.propTypes = {
  classNmae: PropTypes.string,
  icon: PropTypes.oneOf(iconOptions).isRequired,
}

export default CauseIcon
