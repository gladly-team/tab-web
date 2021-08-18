import clsx from 'clsx'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import allStar from 'src/assets/images/allStar.svg'
import consistentKitty from 'src/assets/images/consistentKitty.svg'
import hotPaws from 'src/assets/images/hotPaws.svg'
import AcheivementBackground from 'src/assets/images/AcheivementBackground.svg'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2),
    minWidth: '264px',
    minHeight: '135px',
    display: 'flex',
    backgroundImage: `url(${AcheivementBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '140px',
  },
  subtitleFont: {
    fontSize: '12px',
    color: theme.palette.colors.subtitleGrey,
  },
  titleFont: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  userNameFont: {
    color: theme.palette.colors.blue1,
    wordWrap: 'break-word',
  },
}))
const AcheivementBadge = ({ awardType, user, stat, className }) => {
  const cx = useStyles()
  let awardImage
  let subtitle
  let unit
  switch (awardType) {
    case 'Hot Paws':
      awardImage = hotPaws
      subtitle = 'Most Tabs in a Day'
      unit = 'tabs'
      break
    case 'Consistent Kitty':
      awardImage = consistentKitty
      subtitle = 'Longest Tab Streak'
      unit = 'days'
      break
    case 'All-Star Fur Ball':
      awardImage = allStar
      subtitle = 'Most Tabs Total'
      unit = 'tabs'
      break
    default:
      break
  }
  return (
    <div className={clsx(cx.container, className)}>
      <img
        src={awardImage}
        width="107px"
        style={{ marginRight: '16px' }}
        alt="consistent kitty"
      />
      <div className={cx.textContainer}>
        <Typography className={cx.subtitleFont}>{subtitle}</Typography>
        <Typography className={cx.titleFont}>{awardType}</Typography>
        <Typography>{`${stat} ${unit}`}</Typography>
        <Typography className={cx.userNameFont}>{user}</Typography>
      </div>
    </div>
  )
}
AcheivementBadge.displayName = 'AcheivementBadge'
AcheivementBadge.propTypes = {
  /**
         className applied to the container component
        */
  className: PropTypes.string,

  /**
         The award type
        */
  awardType: PropTypes.string.isRequired,

  /**
         the core text in standard font with overflow 
        */
  stat: PropTypes.number.isRequired,

  /**
         the core text in standard font with overflow 
        */
  user: PropTypes.string.isRequired,
}

AcheivementBadge.defaultProps = {
  className: '',
}

export default AcheivementBadge
