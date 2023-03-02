import * as React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@mui/material/Paper'
import Typography from '@material-ui/core/Typography'
import Markdown from 'src/components/Markdown'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: theme.spacing(6),
  },
  title: {
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 900,
  },
}))
const AboutTheCause = ({ cause }) => {
  const { about } = cause
  const classes = useStyles()

  return (
    <Paper elevation={1} className={classes.contentContainer}>
      <Typography className={classes.title}>About The Cause</Typography>
      <Markdown>{about}</Markdown>
    </Paper>
  )
}

AboutTheCause.propTypes = {
  cause: PropTypes.shape({
    about: PropTypes.string,
  }).isRequired,
}

export default AboutTheCause
