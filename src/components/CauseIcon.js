import React from 'react'
import PropTypes from 'prop-types'
import PetsIcon from '@material-ui/icons/Pets'
import FavoriteIcon from '@material-ui/icons/Favorite'
import SvgIcon from '@material-ui/core/SvgIcon'
import TransgenderIcon from '@mui/icons-material/Transgender'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import {
  mdiJellyfish,
  mdiHandshake,
  mdiPineTree,
  mdiMedicalBag,
  mdiFoodApple,
  mdiWater,
  mdiAccountHeart,
  mdiVote,
  mdiWeatherHurricane,
} from '@mdi/js'

const PAW = 'paw'
const JELLYFISH = 'jellyfish'
const HANDSHAKE = 'handshake'
const PINE_TREE = 'pine-tree'
const MEDICAL_BAG = 'medical-bag'
const FOOD_APPLE = 'food-apple'
const WATER = 'water'
const PERSON_HEART = 'person-heart'
const MONEY = 'money'
const TRANSGENDER = 'transgender'
const VOTE = 'vote'
const HURRICANE = 'hurricane'

const iconOptions = [
  PAW,
  JELLYFISH,
  HANDSHAKE,
  PINE_TREE,
  MEDICAL_BAG,
  FOOD_APPLE,
  WATER,
  PERSON_HEART,
  TRANSGENDER,
  MONEY,
  VOTE,
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
    case VOTE:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiVote}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case HURRICANE:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiWeatherHurricane}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case PERSON_HEART:
      iconComp = (
        <SvgIcon className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={mdiAccountHeart}
            fill="inherit"
          />
        </SvgIcon>
      )
      break
    case MONEY:
      iconComp = <AttachMoneyIcon className={className} />
      break
    case TRANSGENDER:
      iconComp = <TransgenderIcon className={className} />
      break
    default:
      iconComp = <FavoriteIcon className={className} />
      break
  }
  return iconComp
}

CauseIcon.displayName = 'CauseIcon'

CauseIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOf(iconOptions).isRequired,
}

export default CauseIcon
