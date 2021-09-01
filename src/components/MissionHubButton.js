import Button from '@material-ui/core/Button'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'src/components/Link'
import { missionHubURL } from 'src/utils/urls'
import SquadIcon from 'src/assets/icons/SquadIcon'

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.contrastText,
    borderRadius: '20px',
    marginRight: theme.spacing(2),
    paddingTop: '7px',
    paddingBottom: '7px',
  },
}))

const MissionHubButton = ({ status }) => {
  const cx = useStyles()
  let text
  switch (status) {
    case 'pending':
      text = 'mission pending'
      break
    case 'started':
      text = 'mission hub'
      break
    case 'completed':
      text = 'mission hub'
      break
    case 'not started':
      text = 'create a squad'
      break
    default:
      text = 'create a squad'
      break
  }
  return (
    <Link to={missionHubURL}>
      <Button variant="outlined" className={cx.buttonContainer}>
        <SquadIcon />
        {text}
      </Button>
    </Link>
  )
}
MissionHubButton.displayName = 'MissionHubButton'
MissionHubButton.propTypes = {
  /**
    the status of the current mission 
  */
  status: PropTypes.oneOf(['pending', 'started', 'completed', 'not started']),
}
MissionHubButton.defaultProps = {
  status: '',
}
export default MissionHubButton
