import clsx from 'clsx'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: '200px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
}))
const PersonalAcheivementCard = ({ className, title, text }) => {
  const cx = useStyles()
  return (
    <div className={clsx(cx.container, className)}>
      <Typography variant="h5">{title}</Typography>
      <Typography>{text}</Typography>
    </div>
  )
}
PersonalAcheivementCard.displayName = 'PersonalAcheivementCard'
PersonalAcheivementCard.propTypes = {
  /**
         className applied to the container component
        */
  className: PropTypes.string,

  /**
         The title text in bold
        */
  title: PropTypes.string,

  /**
         the core text in standard font with overflow 
        */
  text: PropTypes.string,
}

PersonalAcheivementCard.defaultProps = {
  className: '',
  title: '',
  text: '',
}

export default PersonalAcheivementCard
